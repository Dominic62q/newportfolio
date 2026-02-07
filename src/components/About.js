import React from 'react';

const About = () => {
  const skills = [
    'Python / Django',
    'Java / Springboot',
    'NodeJS / Fastify',
    'Cybersecurity Analyst',
    'RESTful APIs',
    'PostgreSQL & MongoDB'
  ];

  return (
    <section id="about" className="section about-section">
      <div className="section-container">
        <h2 className="section-title">
          About <span>Me</span>
        </h2>
        
        <div className="about-grid">
          <div className="about-text">
            <p>
              I am a versatile <strong>Full-Stack Developer</strong> and 
              <strong> Cybersecurity Analyst</strong> dedicated to building 
              secure, scalable, and high-performance applications.
            </p>
            <p>
              With deep expertise in backend architectures using Django and Springboot, 
              I ensure that every line of code is not only functional but also fortified 
              against modern security threats.
            </p>
          </div>

          <div className="skills-grid">
            {skills.map((skill) => (
              <div key={skill} className="skill-badge">
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;