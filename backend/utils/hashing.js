import crypto from "crypto";

export async function hash(password){
	return new Promise((resolve, reject) => {
		// generate random 16 bytes long salt
		const salt = crypto.randomBytes(16).toString("hex");

		crypto.scrypt(password, salt, 64, (err, derivedKey) => {
			if (err) {
				reject(err);
			}
			resolve({
                salt,
                hash: derivedKey.toString("hex"),
            });
		});
	});
}

export async function verify(password, hash, salt) {
    return new Promise((resolve, reject) => {
        crypto.scrypt(password, salt, 64, (err, derivedKey) => {
            if (err) {
              reject(err);
            }
            resolve(hash == derivedKey.toString('hex'))
        });
    })
}

export default hash;
