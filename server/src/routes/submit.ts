import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { getMegaConfig, getMegaCredentials } from '../config.js';
import { uploadToMega } from '../services/megaUpload.js';

const router = Router();

// Helper function to check mode at runtime (after dotenv loads)
const getUseFileRequest = () => process.env.USE_FILE_REQUEST === 'true';
const getMockMode = () => process.env.MOCK_MODE === 'true';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads');
try {
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
        console.log(`Created uploads directory at: ${uploadsDir}`);
    }
} catch (err: any) {
    console.warn(`Failed to create uploads directory: ${err.message}. Uploads might fail.`);
}

// Configure multer for disk storage (handles large files 1-2 GB efficiently)
const upload = multer({
    storage: multer.diskStorage({
        destination: (_req, _file, cb) => {
            cb(null, uploadsDir);
        },
        filename: (_req, file, cb) => {
            const timestamp = Date.now();
            const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
            cb(null, `${timestamp}_${safeName}`);
        }
    }),
    fileFilter: (_req, file, cb) => {
        // Only accept ZIP files
        if (file.mimetype === 'application/zip' ||
            file.mimetype === 'application/x-zip-compressed' ||
            file.originalname.toLowerCase().endsWith('.zip')) {
            cb(null, true);
        } else {
            cb(new Error('Only ZIP files are allowed'));
        }
    }
});

interface SubmissionBody {
    company: string;
    teamName: string;
    aiTags?: string;
    aiSummary?: string;
}

// ============================================================
// OPTION 1: File Request Mode - Returns URL for user to upload
// ============================================================
router.post('/get-upload-url', async (req: Request, res: Response): Promise<void> => {
    try {
        const { company, teamName } = req.body as SubmissionBody;

        // Validation
        if (!company) {
            res.status(400).json({ success: false, message: 'Company selection required' });
            return;
        }

        if (!teamName) {
            res.status(400).json({ success: false, message: 'Team name required' });
            return;
        }

        // Get File Request URL for the company
        const megaConfig = getMegaConfig(company);

        if (!megaConfig || !megaConfig.fileRequestUrl) {
            console.error(`[ERROR] No File Request URL for company: ${company}`);
            res.status(400).json({ success: false, message: 'Upload not configured for this company' });
            return;
        }

        console.log(`\n${'='.repeat(50)}`);
        console.log(`🔗 File Request URL Generated`);
        console.log(`   Team: ${teamName}`);
        console.log(`   Company: ${megaConfig.companyName}`);
        console.log(`   URL: ${megaConfig.fileRequestUrl}`);
        console.log('='.repeat(50));

        res.json({
            success: true,
            fileRequestUrl: megaConfig.fileRequestUrl,
            companyName: megaConfig.companyName,
            message: `Please upload your file to ${megaConfig.companyName}'s upload page`
        });

    } catch (error: any) {
        console.error('[ROUTE ERROR]', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error occurred'
        });
    }
});

// ============================================================
// OPTION 2: Direct Upload Mode - Upload via MEGA credentials
// ============================================================
router.post('/upload', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
    let tempFilePath: string | undefined;

    try {
        const { company, teamName, aiTags, aiSummary } = req.body as SubmissionBody;
        const file = req.file;

        // Validation
        if (!file) {
            res.status(400).json({ success: false, message: 'No file uploaded' });
            return;
        }

        tempFilePath = file.path; // Store for cleanup

        if (!company) {
            res.status(400).json({ success: false, message: 'Company selection required' });
            return;
        }

        if (!teamName) {
            res.status(400).json({ success: false, message: 'Team name required' });
            return;
        }

        console.log(`\n${'='.repeat(50)}`);
        console.log(`📦 New Submission Received`);
        console.log(`   Team: ${teamName}`);
        console.log(`   Company: ${company}`);
        console.log(`   File: ${file.originalname} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
        if (aiTags) console.log(`   AI Tags: ${aiTags}`);
        console.log(`   Mode: ${getMockMode() ? '🧪 MOCK' : '🔐 LIVE'}`);
        console.log('='.repeat(50));

        // Get credentials based on company
        const credentials = getMegaCredentials(company);

        if (!credentials) {
            console.error(`[ERROR] Unknown company: ${company}`);
            res.status(400).json({ success: false, message: 'Invalid company selection' });
            return;
        }

        // Generate unique filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const uniqueFileName = `${teamName}_${timestamp}_${file.originalname}`;

        // Upload to Mega (using file path for streaming large files)
        const result = await uploadToMega(credentials, file.path, uniqueFileName, file.size);

        if (result.success) {
            console.log(`✅ Successfully uploaded to destination`);
            res.json({
                success: true,
                message: 'Project submitted successfully!',
            });
        } else {
            console.error(`❌ Upload failed: ${result.message}`);
            res.status(500).json({
                success: false,
                message: `Upload failed: ${result.message}`
            });
        }

    } catch (error: any) {
        console.error('[ROUTE ERROR]', error.message, error.stack);
        res.status(500).json({
            success: false,
            message: `Server error: ${error.message}`
        });
    } finally {
        // Clean up: Delete the temporary file after upload
        if (tempFilePath && fs.existsSync(tempFilePath)) {
            try {
                fs.unlinkSync(tempFilePath);
                console.log(`🗑️ Temp file cleaned up: ${tempFilePath}`);
            } catch (cleanupError) {
                console.error(`Failed to clean up temp file: ${tempFilePath}`);
            }
        }
    }
});

// ============================================================
// Health check endpoint
// ============================================================
router.get('/health', (_req: Request, res: Response) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        mode: getUseFileRequest() ? 'file-request' : (getMockMode() ? 'mock' : 'direct-upload')
    });
});

// ============================================================
// Config check endpoint - shows which mode is active
// ============================================================
router.get('/config', (_req: Request, res: Response) => {
    console.log('ENV CHECK:', {
        USE_FILE_REQUEST: process.env.USE_FILE_REQUEST,
        MOCK_MODE: process.env.MOCK_MODE
    });
    res.json({
        useFileRequest: getUseFileRequest(),
        mockMode: getMockMode(),
        companies: ['Senesense Solutions', 'Webbed', 'Techknots']
    });
});

export default router;

