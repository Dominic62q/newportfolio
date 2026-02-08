import React from 'react';

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: 'Reflect Blog Platform',
      description: 'Full-Stack Blogging Application Designed and built a modern, editorial-style blogging platform using React.js and Firebase. Features a high-fidelity Glassmorphism UI built with Tailwind CSS, including cinematic image rendering, real-time content updates, Google Authentication, and an immersive reading experience with scroll-progress tracking.',
      image: '/project1.jpg',
      technologies: ['Javascript', 'React', 'Firebase'],
      demo: 'https://blog-f1a80.web.app/',
      
    },
    {
      id: 2,
      title: 'Domemily Fashion Website',
      description: 'Domemily Website is a full-stack web project focused on building a structured and scalable online platform for managing and presenting fashion content. The application demonstrates practical development skills through clean project organization, media handling, and deployment-ready configuration. Designed with both frontend presentation and backend logic in mind, the project highlights the ability to build real-world web solutions, manage assets efficiently, and prepare applications for production environments. It reflects a strong foundation in web architecture, problem solving, and creating user-focused digital experiences.',
      image: '/project2.jpg',
      technologies: ['Python', 'Django',],
      github: 'https://github.com/Dominic62q/domemily',
      demo: 'https://domemilyfashion.online'
    },
    {
      id: 3,
      title: 'InnerPieces',
      description: 'InnerPieces is a Django-based blog application designed for publishing and managing written content through a clean and structured web platform. The project demonstrates full-stack development skills using Django’s MVC architecture, allowing administrators to create posts with images while users browse articles through a simple and scalable interface.',
      image: '/project3.jpg',
      technologies: ['Python', 'Django',],
      github: 'https://github.com/Dominic62q/InnerPieces',
      demo: 'https://innerpieces-9813729bc1de.herokuapp.com/'
    },
    {
      id: 4,
      title: 'StudyHub',
      description: 'StudyHub is a backend-focused web application designed to help students connect through shared academic interests, create collaborative study groups, and share learning resources within a structured platform. The system includes user authentication, subject-based matching, group management, and resource tracking, demonstrating strong full-stack development skills with relational database design and interactive application logic.',
      image: '/project4.jpg',
      technologies: ['Python', 'Django',],
      github: 'https://github.com/Dominic62q/CAPSTONE-PROJECT',
      demo: 'https://capstone-project-pgx4.onrender.com/'
    }
  ];

  return (
    <section id="projects" className="section projects-section">
      <div className="section-container">
        <h2 className="section-title">
          My <span>Projects</span>
        </h2>
        <p style={{ textAlign: 'center', color: '#a9adb8', fontSize: '1.05rem', marginBottom: '48px', maxWidth: '700px', margin: '0 auto 48px' }}>
          A showcase of my recent work in full-stack development, featuring applications built with modern technologies and best practices.
        </p>

        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-image">
                <img src={project.image} alt={project.title} />
                <div className="project-overlay">
                  <div className="project-links">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link">
                        <span>GitHub</span>
                      </a>
                    )}
                    {project.demo && (
                      <a href={project.demo} target="_blank" rel="noopener noreferrer" className="project-link">
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="project-info">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-tech">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
