const defaultResponse = (data, statusCode = 200) => ({
  data,
  statusCode
});

const errorResponse = (message, statusCode = 400) => defaultResponse({
  error:message,

}, statusCode);

class BooksController {

  constructor(Books) {
    this.Books = Books;
  }
  
  getAll() {
    return this.Books.findAll({})
      .then(result =>  defaultResponse(result))
      .catch(() =>  errorResponse(error.message));
  }

  getById(params) {
    return this.Books.findOne({ where: params })
      .then(result => defaultResponse(result))
      .catch(() => errorResponse(error.message));

  }
}

export default BooksController;
