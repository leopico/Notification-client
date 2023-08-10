import { useCallback, useEffect, useState } from "react";
import io from "socket.io-client";

const hostServer = import.meta.env.VITE_REACT_APP_HOST_SERVER;
// console.log(hostServer);

const socket = io.connect(hostServer);

function App() {
  const [openModel, setOpenModel] = useState(false);
  const [receivedMessage, setReceivedMessage] = useState("");
  const [email, setEmail] = useState("");
  const [emailLoader, setEmailLoader] = useState(false);

  const handleModel = useCallback(() => {
    setOpenModel((value) => !value);
  }, []);

  const notification = "Have watering to seed(id)"; //this valuable has to trigger to send notification

  const sendNotification = () => {
    const messageData = {
      notification: notification,
    };
    if (notification !== "") {
      socket.emit("notification", messageData); //send to server
    }
  };

  useEffect(() => {
    //get from server
    socket.on("receive_message", (data) => {
      setReceivedMessage(data);
    });
  }, []);

  const subject = "Hurry up! Have watering to seed(id)";
  const text = "Hey, giving water before your seed died";

  const sendEmail = async (e) => {
    e.preventDefault();
    setEmailLoader(true);
    try {
      const response = await fetch(`${hostServer}/api/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, subject, text }), // Send the data as JSON
      });

      if (response.ok) {
        console.log("Email sent successfully!");
        setEmailLoader(false);
      } else {
        console.error("Failed to send email.");
        setEmailLoader(false);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setEmailLoader(false);
    }
  };

  return (
    <main className="h-screen">
      <div className="flex flex-col justify-center items-center h-full space-y-3 relative">
        {/* Header */}
        <h1 className="text-slate-600 text-center font-bold text-sm sm:text-base">
          Notification in App and Mail-notification test
        </h1>

        {/* To get notification from Email */}
        <label className="text-sm text-green-400 font-bold">
          Enter your email to get notification
        </label>
        <div className="">
          <form
            onSubmit={sendEmail}
            className="flex justify-center items-center p-1 sm:p-0 w-96"
          >
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="enter your email"
              className="rounded border-2 rounded-r-none border-r-0 p-4 w-40 sm:w-2/3  h-12 outline-none block placeholder-gray-500"
            />
            <button
              type="submit"
              className="rounded rounded-l-none bg-rose-500 w-1/3 h-12 px-4 py-2 text-slate-300"
            >
              {emailLoader ? "loading..." : "Submit"}
            </button>
          </form>
        </div>

        {/* To get notification from App */}
        <label className="text-[11px] sm:text-sm text-green-400 font-bold">
          Get notification for giving water before your seed died
        </label>
        <button
          onClick={sendNotification}
          className="w-72 sm:w-96 rounded bg-rose-500 h-12 px-4 py-2 text-slate-300 font-semibold"
        >
          Please trigger to get notification
        </button>

        {/* Notification Section */}
        <div
          onClick={handleModel}
          className="absolute top-3 right-6 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-green-400 relative flex items-center justify-center text-sm font-bold text-white">
            Noti
          </div>
          {receivedMessage.length !== 0 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 ring-2 ring-slate-100 rounded-full bg-rose-400 flex items-center justify-center">
              <span className="font-bold text-sm text-white">1</span>
            </div>
          )}
        </div>

        {/* Notification Model */}
        {openModel && (
          <div className=" w-56 h-56 sm:w-72 sm:h-72 bg-slate-100 rounded-lg absolute top-16 right-6">
            {receivedMessage.length === 0 ? (
              <span className="flex justify-center items-center h-56 sm:h-72 font-bold text-sm text-green-500">
                There is no notifications
              </span>
            ) : (
              <span className="flex justify-center items-center h-56 sm:h-72 font-bold text-sm text-rose-500">
                Have watering to seed(id)
              </span>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
