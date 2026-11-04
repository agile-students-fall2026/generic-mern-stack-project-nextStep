//reference https://www.npmjs.com/package/@faker-js/faker

import { faker } from '@faker-js/faker'
// creating a fake API to simulate nextStep being used 
export function fetchUserProfile() {
    faker.seed(17) //here the seed is set so user is static 

    const user = {  //creating a random user for demo
        username: faker.internet.username(),
        name: faker.person.firstName(),
        age: 31,
        email: faker.internet.email(),
        password: faker.internet.password(),

    }
    return Promise.resolve(user)
}