const request = require('supertest');
const app = require('./app');

describe('POST auth', () => {
    describe('/log/login given mail and password', () => {
        it('should give 200 response on correct credentials ', async () => {
            const response = await request(app).post("/log/login").send({
                email: "expert1@gmail.com",
                password: "pass@123"
              })
              expect(response.statusCode).toBe(200)
        },20000);
        it('should give 400 response on incorrect credentials', async () => {
            const response = await request(app).post("/log/login").send({
                email: "user@gmail.com",
                password: "pass@123"
            })
            expect(response.statusCode).toBe(400)

        
    })
});
})

describe('get articles',()=>{
    it('should give 200 response',async()=>{
        const response = await request(app).get("/articles")
        expect(response.statusCode).toBe(200)
    })
})

describe('get user information by email',()=>{
    it('should give 200 response',async()=>{
        let email="expert1@gmail.com"
        const response = await request(app).get(`/user/email/${email}`)
        expect(response.statusCode).toBe(200)
    })
    it('should give 404 response',async()=>{
        let email="abc"
        const response = await request(app).get(`/user/email/${email}`)
        expect(response.statusCode).toBe(404)
    })
})

describe('get all information of users and experts',()=>{
    it('should give 200 response',async()=>{
        const response = await request(app).get("/user")
        expect(response.statusCode).toBe(200)
    })
})

describe('get user information based on user id',()=>{
    it('should give 200 response',async()=>{
        let userId="643430f788bd1b9e3366b788"
        const response = await request(app).get(`/user/${userId}`)
        expect(response.statusCode).toBe(200)
    })
 
})


