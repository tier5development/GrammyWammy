import axios from 'axios';
import { host,kyubi } from '../config';

const authService = {
    login: function (payload) {
        return new Promise((resolve, reject) => {
            let options = {
                method: 'POST',
                url: kyubi + '/login',
                headers: {  'Accept': 'application/json', 'Content-Type': 'application/json' },
                data: payload
            }
            axios(options)
                .then(res => {
                    console.log("In Success");
                    resolve(res)
                })
                .catch(err => {
                    console.log("In Error");
                    reject(err)
                })
        })
    },
    userRetrive: function    (payload)   {
        return new Promise((resolve, reject) => {
            let options = {
                method: 'POST',
                url: host + '/api/user/userRetrive',
                headers: {  'Accept': 'application/json', 'Content-Type': 'application/json' },
                data: payload
            }
            axios(options)
                .then(res => {
                    console.log("In Success");
                    resolve(res)
                })
                .catch(err => {
                    console.log("In Error");
                    reject(err)
                })
        })
    }
    
}

export default authService