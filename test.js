const request = require("supertest")
const app = require("./server")
const seed = require("./seed")
const {User, Show} = require('./models')

describe("testing the user router", ()=>{
    
    beforeAll(async()=>{
        await seed()
    })

    test("the user router can all users from the database", async()=>{
        const user = await User.findAll()
        const res = (await request(app).get("/users/")).body
        expect(res.length).toBe(user.length)
        expect(res[0]).toEqual(expect.objectContaining({username: user[0].username, password: user[0].password}))
    })

    test("the user router retrieves one user from the database", async()=>{
        const user = await User.findByPk(1)
        expect((await request(app).get("/users/1")).body).toEqual(expect.objectContaining({username: user.username, password: user.password}))
    })

    test("the user router gets all the shows watched by a user", async()=>{
        const shows = await (await User.findByPk(1)).getShows()
        const res = (await request(app).get("/users/1/shows")).body
        expect(res.length).toBe(shows.length)
        expect(res[0]).toEqual(expect.objectContaining({title: shows[0].title , genre: shows[0].genre, rating: shows[0].rating, status: shows[0].status}))
    })

    test("the user router adds a show to a user", async()=>{
        const show = await Show.findByPk(9)
        await request(app).put("/users/2/shows/9")
        const shows = await (await User.findByPk(2)).getShows()
        expect(shows[0]).toHaveProperty("title", show.title)
    })
})

describe('testing the show router', ()=>{
    
    test("the show router gets all shows from the database", async()=>{
        const shows = await Show.findAll()
        const res = (await request(app).get("/shows/")).body
        expect(res.length).toBe(shows.length)
        expect(res[0]).toEqual(expect.objectContaining({title: shows[0].title , genre: shows[0].genre, rating: shows[0].rating, status: shows[0].status}))
    })

    test("the show router gets one show from the database", async()=>{
        const show = await Show.findByPk(1)
        expect((await request(app).get("/shows/1")).body).toEqual(expect.objectContaining({title: show.title , genre: show.genre, rating: show.rating, status: show.status}))
    })
    
})