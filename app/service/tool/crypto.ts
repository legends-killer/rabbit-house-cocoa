import NodeRSA = require('node-rsa')
import { Service } from 'egg'

export default class CryptoService extends Service {
  RSAKeys() {
    const key = new NodeRSA({ b: 2048 })
    const publicDer = key.exportKey('pkcs1-public-pem')
    const privateDer = key.exportKey('pkcs1-private-pem')

    return { publicDer, privateDer }
  }

  RSASignAndEncrypt(privateKey: string, publicKey: string, hash: string) {
    const key = new NodeRSA({ b: 2048 })
    key.importKey(privateKey, 'pkcs1-private-pem')
    const sign = key.sign(Buffer.from(hash), 'base64', 'utf8')

    key.importKey(publicKey, 'pkcs1-public-pem')
    return { result: key.encrypt(sign, 'base64'), sign }
  }

  RSADecryptAndVerify(privateKey: string, publicKey: string, hash: string) {
    const key = new NodeRSA({ b: 2048 })
    key.importKey(privateKey, 'pkcs1-private-pem')
    const dec = key.decrypt(hash, 'utf8')

    key.importKey(publicKey, 'pkcs1-public-pem')
    return key.verify(Buffer.from(dec), dec, 'utf8', 'base64')
  }
}
