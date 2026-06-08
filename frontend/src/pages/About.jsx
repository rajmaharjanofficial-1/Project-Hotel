import React from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const About = () => {
  return (
    <section className="bg-[#f8f7f4] text-gray-700">
      {/* HERO SECTION */}
      <div className="relative bg-black">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
          alt="Luxury Hotel"
          className="w-full h-[80vh] object-cover opacity-60"
        />

        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={{ duration: 0.8 }}
            className="text-white max-w-3xl"
          >
            <h1 className="text-5xl md:text-6xl font-light tracking-wide">
              Welcome to <span className="font-semibold">QuickStay</span>
            </h1>
            <p className="mt-6 text-lg text-gray-200">
              Where comfort meets elegance, and every stay becomes a story.
            </p>
          </motion.div>
        </div>
      </div>

      {/* STORY SECTION */}
      <div className="max-w-6xl mx-auto px-6 py-24 space-y-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.7 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-4xl font-light text-heading mb-6">
            Our Story
          </h2>
          <p className="text-lg leading-relaxed">
            Every journey begins with a question —
            <span className="font-medium text-heading">
              {" "}“Where should I stay?”
            </span>
            <br /><br />
            QuickStay was born from this simple moment of curiosity.
            We envisioned a platform where booking a stay feels effortless,
            refined, and trustworthy — just like the experience of a luxury hotel itself.
          </p>
        </motion.div>

        {/* IMAGE + TEXT SECTION */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb"
            alt="Hotel Room"
            className="rounded-2xl shadow-xl"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          />

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-light text-heading">
              Designed for Modern Travelers
            </h3>
            <p>
              QuickStay is a modern hotel and room booking platform crafted
              for travelers who value comfort, clarity, and quality.
              From boutique stays to premium hotels, we curate experiences
              that feel personal and reliable.
            </p>
            <p>
              Travel is not just about destinations —
              <span className="italic">
                {" "}it’s about how you feel when you arrive.
              </span>
              And that feeling starts with your stay.
            </p>
          </motion.div>
        </div>

        {/* VALUES SECTION */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <h2 className="text-4xl font-light text-heading mb-12">
            What We Stand For
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Elegance",
                text: "A refined experience that feels premium at every step."
              },
              {
                title: "Trust",
                text: "Verified stays, transparent pricing, and honest choices."
              },
              {
                title: "Simplicity",
                text: "A smooth booking journey designed to save your time."
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white p-10 rounded-2xl shadow-md hover:shadow-xl transition"
                whileHover={{ y: -8 }}
              >
                <h3 className="text-2xl font-medium text-heading mb-4">
                  {item.title}
                </h3>
                <p>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FINAL STATEMENT */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.7 }}
          className="text-center max-w-4xl mx-auto"
        >
          <p className="text-xl text-heading font-light leading-relaxed">
            Wherever your journey takes you —
            <br />
            <span className="font-medium">
              QuickStay is here to elevate your stay.
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
