// Company to MEGA File Request URL mapping
export interface MegaConfig {
    fileRequestUrl: string;
    companyName: string;
}

export type CompanyName = 'senesense' | 'webbed' | 'techknots';

// Get MEGA File Request URL for a company
export const getMegaConfig = (company: string): MegaConfig | null => {
    const companyLower = company.toLowerCase();

    if (companyLower.includes('senesense')) {
        return {
            fileRequestUrl: process.env.SENESENSE_FILE_REQUEST_URL || '',
            companyName: 'Senesense Solutions'
        };
    }

    if (companyLower.includes('webbed')) {
        return {
            fileRequestUrl: process.env.WEBBED_FILE_REQUEST_URL || '',
            companyName: 'Webbed'
        };
    }

    if (companyLower.includes('techknots')) {
        return {
            fileRequestUrl: process.env.TECHKNOTS_FILE_REQUEST_URL || '',
            companyName: 'Techknots'
        };
    }

    return null;
};

// Legacy support - keep for backwards compatibility
export interface MegaCredentials {
    email: string;
    password: string;
}

export const getMegaCredentials = (company: string): MegaCredentials | null => {
    const companyLower = company.toLowerCase();

    if (companyLower.includes('senesense')) {
        return {
            email: process.env.SENESENSE_MEGA_EMAIL || '',
            password: process.env.SENESENSE_MEGA_PASSWORD || ''
        };
    }

    if (companyLower.includes('webbed')) {
        return {
            email: process.env.WEBBED_MEGA_EMAIL || '',
            password: process.env.WEBBED_MEGA_PASSWORD || ''
        };
    }

    if (companyLower.includes('techknots')) {
        return {
            email: process.env.TECHKNOTS_MEGA_EMAIL || '',
            password: process.env.TECHKNOTS_MEGA_PASSWORD || ''
        };
    }

    return null;
};
