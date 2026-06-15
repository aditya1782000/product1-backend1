export type AsyncResponseType = {
    statusCode: number;
    success: boolean;
    message: string;
    data?: unknown;
    draw?: number;
    recordsTotal?: number;
    recordsFiltered?: number;
}