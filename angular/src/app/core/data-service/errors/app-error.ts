export class AppError {
  public message: string;
  public details: string;

  constructor(public data: any) {

    if (data && data.error) {
      if (data.error.message) {
        this.message = data.error.message;
        this.details = data.error.details;
      } else {
        let modelStateErrors = '';
        const serverError = data.error;

        if (serverError) {
          for (const key in serverError) {
            if (serverError[key]) {
              modelStateErrors += serverError[key] + '\r\n';
            }
          }
        }

        this.message = modelStateErrors = '' ? null : modelStateErrors;
      }
    }

    if (this.message == null) {
      if (typeof data === 'string') {
        this.message = data;
      }
    }
  }
}
