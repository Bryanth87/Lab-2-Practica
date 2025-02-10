import jwt from "jsonwebtoken";

export const generateJWT = (uid = "", role = "") => {
    return new Promise((resolve, reject) => {
        const payload = { uid, role };

        jwt.sign(
            payload,
            process.env.SECRETORPRIVATEKEY,
            {
                expiresIn: "1h"
            },
            (errorr, token) =>{
                if(errorr){
                    reject({
                        success: false,
                        message: errorr
                    })
                }else{
                    resolve(token)
                }
            }
        )
    })
}

