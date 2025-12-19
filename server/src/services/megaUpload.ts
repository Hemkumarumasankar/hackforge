import { Storage } from 'megajs';
import fs from 'fs';
import { MegaCredentials } from '../config.js';

export interface UploadResult {
    success: boolean;
    message: string;
    fileUrl?: string;
}

// Check if we're in mock mode (for testing without real MEGA credentials)
const MOCK_MODE = process.env.MOCK_MODE === 'true';

export const uploadToMega = async (
    credentials: MegaCredentials,
    filePath: string,
    fileName: string,
    fileSize: number
): Promise<UploadResult> => {

    // 🧪 MOCK MODE - Simulate successful upload for testing
    if (MOCK_MODE) {
        console.log(`\n🧪 [MOCK MODE] Simulating upload...`);
        console.log(`   📁 File: ${fileName}`);
        console.log(`   📦 Size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);

        // Simulate network delay based on file size (faster for testing)
        const simulatedDelay = Math.min(3000, 1000 + (fileSize / 1024 / 1024) * 10);
        await new Promise(resolve => setTimeout(resolve, simulatedDelay));

        const mockUrl = `https://mega.nz/mock/${Date.now()}/${encodeURIComponent(fileName)}`;
        console.log(`   ✅ Mock upload complete!`);
        console.log(`   🔗 Mock URL: ${mockUrl}\n`);

        return {
            success: true,
            message: 'File uploaded successfully (MOCK MODE)',
            fileUrl: mockUrl
        };
    }

    // 🔐 REAL MODE - Upload to actual MEGA storage
    // Validate credentials
    if (!credentials.email || !credentials.password) {
        console.error('Missing Mega credentials');
        return {
            success: false,
            message: 'Server configuration error: Missing storage credentials'
        };
    }

    try {
        console.log(`[MEGA] Connecting as ${credentials.email.substring(0, 3)}***...`);

        // Create storage instance and login
        const storage = await new Storage({
            email: credentials.email,
            password: credentials.password
        }).ready;

        console.log(`[MEGA] Connected successfully. Uploading ${fileName} (${(fileSize / 1024 / 1024).toFixed(2)} MB)...`);

        // Create a read stream for efficient large file handling
        // Increase highWaterMark to 1MB to improve throughput
        const fileStream = fs.createReadStream(filePath, { highWaterMark: 1024 * 1024 });

        // Monitor stream progress
        let bytesUploaded = 0;
        const totalSize = fileSize;
        let lastLoggedPercent = 0;

        fileStream.on('data', (chunk) => {
            bytesUploaded += chunk.length;
            const percent = Math.floor((bytesUploaded / totalSize) * 100);

            // Log every 5%
            if (percent >= lastLoggedPercent + 5) {
                console.log(`[MEGA] Upload progress: ${percent}% (${(bytesUploaded / 1024 / 1024).toFixed(2)} MB / ${(totalSize / 1024 / 1024).toFixed(2)} MB)`);
                lastLoggedPercent = percent;
            }
        });

        // Upload file to root directory using stream
        // Cast stream to any to avoid TypeScript issues (megajs supports streams at runtime)
        const uploadedFile = await storage.upload({
            name: fileName,
            size: fileSize
        }, fileStream as any).complete;

        // Get the file link
        const fileLink = await uploadedFile.link({});

        console.log(`[MEGA] Upload complete: ${fileName}`);

        // Close the connection
        storage.close();

        return {
            success: true,
            message: 'File uploaded successfully',
            fileUrl: fileLink
        };

    } catch (error: any) {
        console.error('[MEGA] Upload failed:', error.message);
        return {
            success: false,
            message: `Upload failed: ${error.message}`
        };
    }
};
