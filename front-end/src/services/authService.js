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
    },
    forgotPassword: function (payload) {
        return new Promise((resolve, reject) => {
            console.log(payload);
            let options = {
                method: 'POST',
                mode: "cors", // no-cors, cors, *same-origin
                url: kyubi + '/generate-password-token',
                headers: {  'Accept': 'application/json', 'Content-Type': 'application/json' },
                data: JSON.stringify(payload)
            }
            axios(options)
                .then(res => {
                    console.log("In Success");
                    resolve(res)
                })
                .catch(err => {
                    console.log("Error In Forgot Password");
                    reject(err)
                })
        })

    }
    
}

export default authService