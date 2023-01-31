import { useEffect, useState } from "react";
import Chat from "./Chat.js";
import "./Homepage.css";
import { ethers } from "ethers";
import ABI from "./ABI.json";

function Homepage(props) {

    /**
     * @pagination gets kinda a number of a @page to display more messages
     */
    const [message, setMessage] = useState("");
    const [allChats, setAllChats] = useState([]);
    const [pagination, setPagination] = useState(0);

    const sendMessage = async () => {
        console.log("Running sendMessage");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            "0x027778474953c38aEf46ADE7b08357C88773f4af",
            ABI,
            signer
        );

        const addMessage = await contract.addMessage(message, 0)
        console.log("addMessage(): " + addMessage);
    }

    const getMessages = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            "0x027778474953c38aEf46ADE7b08357C88773f4af",
            ABI,
            signer
        );

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
                            <Chat text={item.sentMessage} data={item.sendFrom} />
        
                        ))}
                          {/* <Chat text="YO" image="https://yt3.ggpht.com/ytc/AMLnZu-2DrkobCQd6ri63wO9SuMFGyTbyMhD5kQ6Up2N=s900-c-k-c0x00ffffff-no-rj" data="Oct 20, 2022 8:12PM" /> */}
                          {/* <Chat text="Chat message" image="https://yt3.ggpht.com/ytc/AMLnZu-2DrkobCQd6ri63wO9SuMFGyTbyMhD5kQ6Up2N=s900-c-k-c0x00ffffff-no-rj" data="Oct 20, 2022 8:12PM" /> */}
                          {/* <Chat text="This is a test" image="https://yt3.ggpht.com/ytc/AMLnZu-2DrkobCQd6ri63wO9SuMFGyTbyMhD5kQ6Up2N=s900-c-k-c0x00ffffff-no-rj" data="Oct 20, 2022 8:12PM" /> */}
                    </div>

                      <div classname="Send">
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