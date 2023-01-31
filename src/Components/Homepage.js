import { useEffect, useState } from "react";
import Chat from "./Chat.js";
import "./Homepage.css";
import { ethers } from "ethers";
import ABI from "./ABI.json";
import { concat } from "ethers/lib/utils.js";

function Homepage(props) {

    /**
     * @pagination gets kinda a number of a @page to display more messages
     * @NFT and @NFTList variable gets called on @getNFTs function
     */
    const [message, setMessage] = useState("");
    const [allChats, setAllChats] = useState([]);
    const [pagination, setPagination] = useState(0);
    const [NFT, setNFT] = useState(0);
    const [NFTList, setNFTList] = useState([])

    const sendMessage = async () => {
        console.log("Running sendMessage");
        // Get the contract 
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            "0x027778474953c38aEf46ADE7b08357C88773f4af",
            ABI,
            signer
        );

        const addMessage = await contract.addMessage(message, NFT)
        console.log("addMessage(): " + addMessage);
    }

    const getMessages = async () => {
        // Get the contract 
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            "0x027778474953c38aEf46ADE7b08357C88773f4af",
            ABI,
            signer
        );

        /**
         * Setting up a function to get the switched NFT token from the @onChange @nftId
         */
        // getNFTs();
        // Get the current wallet address 
        const currentAddress = provider.getSigner().getAddress();
        console.log("Show current wallet address: " + currentAddress);

        const amountOfNFTs = await contract.balanceOf(currentAddress);
        console.log("Show balanceOf current wallet address: " + amountOfNFTs);

        for(let i = 0; i < amountOfNFTs; i++) {
            const currentNFT = await contract.tokenOfOwnerByIndex(currentAddress, i);
            setNFTList(old => [...old, currentNFT]);
            console.log("Show current NFT: " + currentNFT);
        }

        /**
         * @page the number of how many messages gets displayed on a @page
         * @totalMessages get all the messages from the blockchin
         * @starting counts the messages back
         */

        const totalMessages = await contract.totalMessages();
        console.log("Running totalMessages:");
        console.log(totalMessages);

        const page = 10;
        // const pagination = 4;
        // const totalMessages = 150
        const starting = totalMessages - (page * pagination) - 1;

        setAllChats([]);

        /**
         * Loops through all the @totalMessages from the blockchain and push the @currentMessage (i) to the array @setAllChats
         */
        for(let i = starting; i > starting - page; i--) {
            console.log(i);
            if(i >= 0) {
                const currentMessage = await contract.Messages(i);
                console.log("Running currentMessages:");
                console.log(currentMessage);
                setAllChats(prevChat => [...prevChat, currentMessage]);
            }
        }
    }

    // const getNFTs = async () => {
    //     // Get the contract 
    //     const provider = new ethers.providers.Web3Provider(window.ethereum);
    //     const signer = provider.getSigner();
    //     const contract = new ethers.Contract(
    //         "0x027778474953c38aEf46ADE7b08357C88773f4af",
    //         ABI,
    //         signer
    //     );

    //     // Get the current wallet address 
    //     const currentAddress = provider.getSigner().getAddress();
    //     console.log("Show current wallet address: " + currentAddress);

    //     const amountOfNFTs = await contract.balanceOf(currentAddress);
    //     console.log("Show balanceOf current wallet address: " + amountOfNFTs);

    //     for(let i = 0; i < amountOfNFTs; i++) {
    //         const currentNFT = await contract.tokenOfOwnerByIndex(currentAddress, i);
    //         setNFTList(old => [...old, currentNFT]);
    //         console.log("Show current NFT: " + currentNFT);
    //     }
    // }

    const chainChanged = () => {
        // Reloads the website
        window.location.reload();
    };
    
    // Listen to Wallet
    window.ethereum.on('chainChanged', chainChanged);
    // Looks for changing accounts
    // window.ethereum.on('accountsChanged', getWalletAddress);

    window.ethereum.on('accountsChanged', getMessages);

    useEffect(() => {
        getMessages();
    }, []);

    /**
     * @back and @forward creates the functions to switch the @pagination
     */
    const back = async () => {
        setPagination((old) => old + 1);
        getMessages();
    }
    
    const forward = async () => {
        setPagination((old) => old - 1);
        getMessages();
    }

   

    return (
        <section>
                  <div class="hero">
                  {/* <button class="header-cta"><a onClick={back} href="#">Back</a></button> */}
                  {/* <button class="header-cta"><a onClick={forward} href="#">Forward</a></button> */}
                  
                  <button class="header-cta" onClick={back} >Back</button>
                  <button class="header-cta" onClick={forward} >Forward</button>

                      <div className="chatMessage">
                        {allChats.map((item) => (
                            <Chat text={item.sentMessage} data={`${item.sendFrom} NFT ${item.nftId}`} />
        
                        ))}
                          {/* <Chat text="YO" image="https://yt3.ggpht.com/ytc/AMLnZu-2DrkobCQd6ri63wO9SuMFGyTbyMhD5kQ6Up2N=s900-c-k-c0x00ffffff-no-rj" data="Oct 20, 2022 8:12PM" /> */}
                          {/* <Chat text="Chat message" image="https://yt3.ggpht.com/ytc/AMLnZu-2DrkobCQd6ri63wO9SuMFGyTbyMhD5kQ6Up2N=s900-c-k-c0x00ffffff-no-rj" data="Oct 20, 2022 8:12PM" /> */}
                          {/* <Chat text="This is a test" image="https://yt3.ggpht.com/ytc/AMLnZu-2DrkobCQd6ri63wO9SuMFGyTbyMhD5kQ6Up2N=s900-c-k-c0x00ffffff-no-rj" data="Oct 20, 2022 8:12PM" /> */}
                    </div>

                      <div classname="Send">

                      {/* Add onChange to switch on NFT tokens and send the NFT token with the message  */}
                        <select onChange={ (e) => setNFT(e.target.value)} name="NFTid" id="NFTid">
                            {NFTList.map((item) => (
                                <option key={item.toString()} value={item.toString()}>{item.toString()}</option>
                            ))}
                            {/* <option key={1} value="1">This is option 1</option> */}
                        </select>
                          <input
                              className="textInput"
                              type="text"
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                          />
                          <button class="header-cta" onClick={sendMessage} ><a href="#">Send</a></button>
                      </div>
                  </div>
                </section> 
    );
}
export default Homepage;