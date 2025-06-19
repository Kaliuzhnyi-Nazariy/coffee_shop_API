const errors: { [key: number]: string } = {
  400: "Bad request!",
  401: "Unauthorized",
  404: "Not found!",
  409: "Conflict!",
  500: "Server error",
};

const errorHandler = (
  status: number = 500,
  message: string = errors[status]
) => {
  const error = new Error(message);
  (error as any).status = status;

  throw error;
};

export default errorHandler;
