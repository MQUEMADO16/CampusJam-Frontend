import React from "react";
import { Button } from "antd";
import { Music, MessageCircle, Guitar } from "lucide-react";

const Splash: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col text-white">
      {/* Hero Section */}
      <div
        className="relative flex flex-col justify-center items-center text-center px-4 py-24"
        style={{
          backgroundImage:    // TODO: Replace with correct image
            "url('https://media.gettyimages.com/id/1413427894/photo/teenage-friends-singing-and-playing-guitar-during-band-practice-in-garage.jpg?s=612x612&w=gi&k=20&c=NAoliR3c7azAZbFHXmdb_F_0uNUhHN8oVVRa89dF71w=')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Your Campus Music Scene, Connected.
          </h1>
          <p className="text-lg mb-8 text-gray-200">
            Connect with campus musicians. Your jam awaits.
          </p>

          <div className="flex justify-center gap-4">
            <Button
              type="primary"
              size="large"
              shape="round"
              style={{
                backgroundColor: "#e20074",
                borderColor: "#e20074",
                fontWeight: 600,
              }}
            >
              Find a Session
            </Button>
            <Button
              size="large"
              shape="round"
              style={{
                borderColor: "white",
                color: "white",
                fontWeight: 600,
              }}
            >
              Start a Jam
            </Button>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-white text-gray-900 py-16 px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          {/* DISCOVER */}
          <div className="bg-gray-50 rounded-2xl shadow-md p-8 hover:shadow-lg transition">
            <Music className="mx-auto mb-4 text-pink-600" size={36} />
            <h3 className="text-xl font-semibold mb-2">DISCOVER</h3>
            <p className="text-gray-600">
              Find jam sessions around campus. Discover your school’s sound.
            </p>
          </div>

          {/* CONNECT */}
          <div className="bg-gray-50 rounded-2xl shadow-md p-8 hover:shadow-lg transition">
            <MessageCircle className="mx-auto mb-4 text-pink-600" size={36} />
            <h3 className="text-xl font-semibold mb-2">CONNECT</h3>
            <p className="text-gray-600">
              Link up with fellow student musicians on your campus. Expand your
              network.
            </p>
          </div>

          {/* CREATE */}
          <div className="bg-gray-50 rounded-2xl shadow-md p-8 hover:shadow-lg transition">
            <Guitar className="mx-auto mb-4 text-pink-600" size={36} />
            <h3 className="text-xl font-semibold mb-2">CREATE</h3>
            <p className="text-gray-600">
              Craft your sound together. Share your music with your community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Splash;
