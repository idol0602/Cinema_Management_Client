export interface importResponse {
    success: boolean,
    message: string | null,
    data: {
        imported: number
        skipped: number
    }
}