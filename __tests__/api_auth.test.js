import { app } from "../index"
import request from "supertest"

it("return 200 when sign up", () => request(app).get("/").expect(200))
