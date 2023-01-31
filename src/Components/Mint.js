import "./Mint.css";
import { ethers } from "ethers";
import ABI from "./ABI.json"

function Mint(props) {

    const mint = async () => {
        console.log("Running Mint:");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            "0x027778474953c38aEf46ADE7b08357C88773f4af",
            ABI,
            signer
        );
        const price = await contract.price();
        console.log("show price of NFT in wai: " + price);
        console.log(price);

        const tryToMint = await contract.safeMint({value: price});

        console.log("Running tryToMint: " + tryToMint);
    }

    return (
        <div>
            <button onClick={mint} class="mint-button">Mint
                {/* <a onClick={mint} href="#">Mint</a> */}
            </button>
        </div>


    );



}

export default Mint;