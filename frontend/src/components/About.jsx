import './About.css'

function About() {
    return (
        <div className="about-page">
            <div className="about-hero">
                <h1 className="about-title">Our Story</h1>
                <p className="about-subtitle">Preserving Tradition, One Artifact at a Time</p>
            </div>

            <div className="about-content">
                <section className="about-section">
                    <div className="about-text">
                        <h2>The Artisan Treasures Mission</h2>
                        <p>
                            At Artisan Treasures, we believe that every object tells a story. Our mission is to connect
                            skilled artisans from around the world with people who appreciate the beauty of handcrafted
                            goods. We are dedicated to preserving traditional craftsmanship that has been passed down
                            through generations.
                        </p>
                        <p>
                            In a world of mass production, we stand for the unique, the imperfect, and the human touch.
                            Each item in our collection is hand-selected for its quality, authenticity, and the story
                            it carries.
                        </p>
                    </div>
                    <div className="about-image-container">
                        <img
                            src="https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?auto=format&fit=crop&q=80&w=800"
                            alt="Artisan working on pottery"
                            className="about-image"
                        />
                    </div>
                </section>

                <section className="about-section reverse">
                    <div className="about-text">
                        <h2>Supporting Local Communities</h2>
                        <p>
                            We work directly with artisans, ensuring fair trade practices and sustainable livelihoods.
                            By cutting out middlemen, we ensure that the creators receive fair compensation for their
                            incredible work. Your purchase directly supports these communities and helps keep their
                            traditions alive.
                        </p>
                        <p>
                            From the souks of Morocco to the pottery workshops of Japan, we travel the globe to bring
                            you the finest traditional goods.
                        </p>
                    </div>
                    <div className="about-image-container">
                        <img
                            src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800"
                            alt="Traditional rug weaving"
                            className="about-image"
                        />
                    </div>
                </section>

                <section className="values-section">
                    <h2>Our Core Values</h2>
                    <div className="values-grid">
                        <div className="value-card">
                            <div className="value-icon">👐</div>
                            <h3>Handcrafted</h3>
                            <p>We celebrate the human touch in every product we offer.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon">🌍</div>
                            <h3>Sustainable</h3>
                            <p>We prioritize eco-friendly materials and ethical production methods.</p>
                        </div>
                        <div className="value-card">
                            <div className="value-icon">🤝</div>
                            <h3>Fair Trade</h3>
                            <p>We ensure artisans are paid fairly for their skill and labor.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default About
