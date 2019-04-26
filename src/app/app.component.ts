import { Component } from '@angular/core';
import * as firebase from "firebase"
import * as config from "../APIKeys"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  ws = new WebSocket("wss://emotivcortex.com:54321")

  step = 1
  authToken = null
  sesionId = null

  constructor() {
    console.log(config.default)

    firebase.initializeApp(config.default)

    this.step = 0
    this.ws.onopen = () => {
      console.log("Djesi")

      this.ws.send(JSON.stringify(
        {
          "jsonrpc": "2.0",
          "method": "authorize",
          "params": {},
          "id": 1
        }
      ))
    }

    this.ws.onmessage = data => {
      console.log(JSON.parse(data.data))

      if (this.step == 0) {
        this.authToken = JSON.parse(data.data).result._auth
        console.log(this.authToken)

        this.ws.send(JSON.stringify(
          {
            "jsonrpc": "2.0",
            "method": "createSession",
            "params": {
              "_auth": this.authToken,
              "status": "open"
            },
            "id": 1
          }
        ))
      }

      if (this.step == 1) {
        this.sesionId = JSON.parse(data.data).result.id

        this.ws.send(JSON.stringify(
          {
            "jsonrpc": "2.0",
            "method": "subscribe",
            "params": {
              "_auth": this.authToken,
              "sesion": this.sesionId,
              "streams": [
                "mot", "com", "fac", "met", "dev", "pow", "sys"
              ]
            },
            "id": 1
          }
        ))
      }

      if (this.step > 2) {
        let motA = JSON.parse(data.data).mot
        let comA = JSON.parse(data.data).com
        let facA = JSON.parse(data.data).fac
        let metA = JSON.parse(data.data).met
        let devA = JSON.parse(data.data).dev
        let powA = JSON.parse(data.data).pow
        let sysA = JSON.parse(data.data).sys

        if (motA != undefined) {
          let mot = {
            imd_counter: motA[0],
            imd_gyrox: motA[1],
            imd_gyroy: motA[2],
            imd_gyroz: motA[3],
            imd_accx: motA[4],
            imd_accy: motA[5],
            imd_accz: motA[6],
            imd_magx: motA[7],
            imd_magy: motA[8],
            imd_magz: motA[9]
          }

          firebase.database().ref("/mot").set(mot)
        }
        
        if (comA != undefined) {
          let com = {
            act: comA[0],
            pow: comA[1]
          }

          firebase.database().ref("/com").set(com)
        }

        if (facA != undefined) {
          let fac = {
            eyeAct: facA[0],
            uAct: facA[1],
            uPow: facA[2],
            lAct: facA[3],
            lPow: facA[4]
          }

          firebase.database().ref("/fac").set(fac)
        }

        if (metA != undefined) {
          let met = {
            int: metA[0],
            str: metA[1],
            rel: metA[2],
            exc: metA[3],
            eng: metA[4],
            lex: metA[5],
            foc: metA[6]
          }

          firebase.database().ref("/met").set(met)
        }
        
        if (devA != undefined) {
          let dev = {
            battery: devA[0],
            signal: devA[1],
            iee_chan_af3: devA[2][0],
            iee_chan_t7: devA[2][1],
            iee_chan_pz: devA[2][2],
            iee_chan_t8: devA[2][3],
            iee_chan_af4: devA[2][4]
          }

          firebase.database().ref("/dev").set(dev)
        }

        if (powA != undefined) {
          let pow = {
            ied_af3_theta: powA[0],
            ied_af3_alpha: powA[1],
            ied_af3_betaL: powA[2],
            ied_af3_betaH: powA[3],
            ied_af3_gamma: powA[4],
            ied_t7_theta: powA[5],
            ied_t7_alpha: powA[6],
            ied_t7_betaL: powA[7],
            ied_t7_betaH: powA[8],
            ied_t7_gamma: powA[9],
            ied_pz_theta: powA[10],
            ied_pz_alpha: powA[11],
            ied_pz_betaL: powA[12],
            ied_pz_betaH: powA[13],
            ied_pz_gamma: powA[14],
            ied_t8_theta: powA[15],
            ied_t8_alpha: powA[16],
            ied_t8_betaL: powA[17],
            ied_t8_betaH: powA[18],
            ied_t8_gamma: powA[19],
            ied_af4_theta: powA[20],
            ied_af4_alpha: powA[21],
            ied_af4_betaL: powA[22],
            ied_af4_betaH: powA[23],
            ied_af4_gamma: powA[24]
          }

          firebase.database().ref("/pow").set(pow)
        }

        if (sysA != undefined) {
          let sys = {
            act: sysA[0],
            pow: sysA[1]
          }

          firebase.database().ref("/sys").set(sysA)
        }

      }

      this.step++
    }
  }
}
