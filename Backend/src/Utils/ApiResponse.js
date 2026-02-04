//steps
// create ApiResponse class with constructor taking statusCode, data, message
// set success based on statusCode
// export ApiResponse class
class ApiResponse{
    constructor(
        statusCode,
        data,
        message="success",

    ){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode<400;
    }
}
export{ ApiResponse};