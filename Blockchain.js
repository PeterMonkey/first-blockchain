const SHA256 = require ('crypto-js/sha256');

class Block {
    constructor(index, data, previousHash = ''){
        this.index = index;    // Posicion que ocupa
        this.date = new Date();  // Fecha de creacion
        this.data = data; // Informacion guardada en el bloque
        this.previousHash = previousHash;  // hash del bloque anterior
        this.hash = this.createHash(); //hash generado  
        this.nonce = 0; // numero que se utiliza para generar un hash que cumpla una condicion concreta
    }

    createHash() {     // aqui se crea el hash
        return SHA256(this.index + this.date + this.data + this.previousHash + this.nonce).toString(); // el toString() me devuerlve un string
    }

    mine(difficulty) {      // minador 
        while(!this.hash.startsWith(difficulty)) { // mientras el comienzo del hash no sea la dificultad varie el numero nonce
              this.nonce++;
              this.hash = this.createHash(); 
        }
    }
}

class Blockchain {
    constructor(genesis, difficulty = '00'){
        this.chain = [this.createFirstBlock(genesis)];
        this.difficulty = difficulty;
    }
    createFirstBlock(genesis){
        return new Block(0, genesis);
    }
    getLastBlock() {                         // traernos el ultimo bloque
        return this.chain[this.chain.length-1];
    }
    addBlock(data) {
        let prevBlock = this.getLastBlock();
        let block = new Block(prevBlock.index+1, data, prevBlock.hash);
        block.mine(this.difficulty);
        console.log('Minado!' + block.hash +' con nonce '+block.nonce);
        this.chain.push(block);
    }

    isValid() {
        for(let i=1; i<this.chain.length; i++){
            let prevBlock = this.chain[i-1]; // elemento anterior de la cadena (i=1 ; bloque  0)
            let currBlock = this.chain[i];  // elemento anterior de la cadena (i=1 ; bloque  1)

            if(currBlock.previousHash != prevBlock.hash)
            return false;

            if(currBlock.createHash() != currBlock.hash)
            return false;
        }
        return true;
    }
}

/*block = new Block(0, 'prueba');
console.log(JSON.stringify(block, null, 2));*/

let coronaCoin = new Blockchain('info de genesis', '00');

coronaCoin.addBlock('esta cryptomoneda es la mejor');
coronaCoin.addBlock("valgo $100");      // info del segundo bloque
coronaCoin.addBlock("valgo $100");      // info del segundo bloque
coronaCoin.addBlock("valgo $100");      // info del segundo bloque

 console.log(coronaCoin.isValid());
console.log(JSON.stringify(coronaCoin.chain, null, 2));
 