class ApiResponse {
    statusCode: number;
    data: { [key: string]: string } | null;
    message: string;
    success: boolean;

    constructor(
        statusCode: number,
        data: { [key: string]: string } | null,
        message = "Success"
    ) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}

export { ApiResponse };
