"user client";
import React from 'react';

const Page = () => {
  return (
    <div className="font-sans m-0 box-border">
      {/* About BilGreen Section */}
      <section className="bg-[#003731] mx-2.5 my-8 p-10 rounded-2xl">
        <h1 className="text-white text-2xl font-bold mb-5 text-center">
          "Innovating Sustainable Solutions for Industrial Waste Management"
        </h1>
        <div className="text-center">
          <h4 className="text-[#ACB4B8] text-base p-5">
            Founded with a vision to drive innovation and sustainability in the industrial sector, 
            Bilgreen acts as a bridge between businesses looking to efficiently repurpose surplus 
            materials and those seeking cost-effective raw materials.
          </h4>
        </div>
        <div className="flex justify-center items-center">
          <img 
            src="/images/7.png"
            alt="BilGreen"
            className="w-full h-[400px] object-cover rounded-lg"
          />
        </div>
      </section>

      {/* Picture2 Section */}
      <section className="bg-[#EFFCF3] mx-2.5 p-10 rounded-2xl flex items-center gap-10 flex-col md:flex-row">
        <div className="flex-1 pr-5">
          <h1 className="text-black text-2xl font-bold mb-5">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam.
          </h1>
          <h4 className="text-[#8C929E] text-base leading-relaxed px-5 pb-12">
            Our mission is to provide a sustainable solution for industrial waste management 
            by creating a circular economy that benefits both businesses and the environment.
          </h4>
          <button className="bg-[#4CAF50] text-white px-5 py-2 text-2xl rounded-full hover:bg-[#45a049] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:ring-opacity-30">
            Join us
          </button>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <img 
            src="/images/6.jpeg"
            alt="Sustainable Solutions"
            className="w-full h-[400px] object-cover rounded-lg"
          />
        </div>
      </section>

      {/* Special About BilGreen Section */}
      <section className="max-w-7xl mx-auto p-10 text-center">
        <h1 className="text-[#1a2942] text-4xl mb-12 leading-tight">
          What is special about<br />BILGREEN
        </h1>

        <div className="flex justify-around gap-24 flex-wrap">
          <div className="flex-1 min-w-[300px] p-5">
            <div className="w-12 h-12 mx-auto mb-5 flex items-center justify-center text-2xl text-[#4a90e2]">
              ♻️
            </div>
            <h2 className="text-[#1a2942] text-lg mb-4 font-semibold">
              Sustainability
            </h2>
            <p className="text-gray-600 leading-relaxed text-base">
              We ensure transparency and trust in every transaction, fostering strong 
              relationships within the industrial community
            </p>
          </div>

          <div className="flex-1 min-w-[300px] p-5">
            <div className="w-12 h-12 mx-auto mb-5 flex items-center justify-center text-2xl text-[#4a90e2]">
              🛡
            </div>
            <h2 className="text-[#1a2942] text-lg mb-4 font-semibold">
              Integrity
            </h2>
            <p className="text-gray-600 leading-relaxed text-base">
              We ensure transparency and trust in every transaction, fostering strong 
              relationships within the industrial community
            </p>
          </div>

          <div className="flex-1 min-w-[300px] p-5">
            <div className="w-12 h-12 mx-auto mb-5 flex items-center justify-center text-2xl text-[#4a90e2]">
              💫
            </div>
            <h2 className="text-[#1a2942] text-lg mb-4 font-semibold">
              Innovation
            </h2>
            <p className="text-gray-600 leading-relaxed text-base">
              Our responsive customer service team support you at every step of the way, 
              ensuring a smooth and satisfactory trading experience
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;