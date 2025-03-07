class UserController {
    async create(req, res, next) {
        const { name, email } = req.body;
    
        if (!name || !email) {
            return next(new ValidationError('Поля "name" и "email" обязательны для заполнения.'));
        }
    
        next(UserService.create(name, email));
    }
}

module.export = new UserController();