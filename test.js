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
    
    test("the show router gets shows of a specific genre", async()=>{
        const shows = await Show.findAll({where: {genre: "Comedy"}})
        const res = (await request(app).get("/shows/genres/Comedy")).body
        expect(res.length).toBe(shows.length)
        for (let i of res){
            expect(i).toHaveProperty("genre", "Comedy")
        }
    })

    describe("the show router updates the rating of a show", ()=>{

        test("with valid inputs", async()=>{
            await request(app).put("/shows/4/watched/10000")
            expect(await Show.findByPk(4)).toHaveProperty("rating", 10000)
        })

        test("the rating field cannot be empty", async()=>{
            expect((await request(app).put("/shows/11/watched/undefined")).text).toBe("cannot have empty parameters")
        })

    })

    describe("the show router updates the status of a show", ()=>{

        test("the status is updated for valid values", async()=>{
            await request(app).put("/shows/6/updates").send({status :"canceled"})
            expect(await Show.findByPk(6)).toHaveProperty("status", "canceled")
        })

        test("the status field cannot be empty", async()=>{
            expect((await request(app).put("/shows/6/updates").send({status : undefined})).text).toBe("status cannot be empty or whitespace and must be between 5 and 25 characters")
        })

        test("the status field must be more than 5 letters", async()=>{
            expect((await request(app).put("/shows/6/updates").send({status : "hi"})).text).toBe("status cannot be empty or whitespace and must be between 5 and 25 characters") 
        })

        test("the status field must be less than 25 letters", async()=>{
            expect((await request(app).put("/shows/6/updates").send({status : "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"})).text).toBe("status cannot be empty or whitespace and must be between 5 and 25 characters")
        })

    })

    test("the show router can delete a show", async()=>{
        await request(app).delete("/shows/5")
        expect(await Show.findByPk(5)).toBe(null)
    })
})