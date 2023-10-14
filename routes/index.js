import {
    RootGetController, HelloGetController, AboutGetController,
    RootPostController, RootPutController, RootDeleteController,
    RitvikController
} from "../controllers/index.js";

const userRouter = {
    GET: {
        "/": RootGetController,
        "/hello": HelloGetController,
        "/about": AboutGetController,
        "/ritvik": RitvikController
    },
    POST: {
        "/": RootPostController
    },
    PUT: {
        "/": RootPutController
    },
    DELETE: {
        "/": RootDeleteController
    }
}


export default userRouter;