-- Tabla de Usuarios
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),  -- Nombre del usuario
    last_name VARCHAR(50),   -- Apellido del usuario
    email VARCHAR(100) UNIQUE NOT NULL,  -- Correo electrónico del usuario
    password_hash VARCHAR(255),  -- Contraseña encriptada del usuario
    profile_picture_url VARCHAR(255),  -- URL de la foto de perfil
    bio TEXT,  -- Campo adicional para la descripción "Acerca de..."
    auth_provider VARCHAR(50),  -- Proveedor de autenticación (e.g., 'google', 'github')
    auth_provider_id VARCHAR(255),  -- ID del usuario en el proveedor de autenticación
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Índices para mejorar la búsqueda
CREATE INDEX idx_email ON Users(email);
CREATE INDEX idx_auth_provider ON Users(auth_provider);
CREATE INDEX idx_auth_provider_id ON Users(auth_provider_id);

-- Tabla de Roles
CREATE TABLE Roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL  -- Nombre del rol (e.g., 'admin', 'mentor', 'student')
);

-- Tabla de Relación entre Usuarios y Roles
CREATE TABLE UserRoles (
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    role_id INT REFERENCES Roles(role_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Tabla de Idiomas
CREATE TABLE Languages (
    language_id SERIAL PRIMARY KEY,
    language_name VARCHAR(50) NOT NULL UNIQUE  -- Nombre del idioma
);

-- Tabla de Estudios Profesionales
CREATE TABLE UserProfessionalStudies (
    study_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE, -- Referencia al usuario
    degree VARCHAR(100) NOT NULL, -- Título del estudio (e.g., "Ingeniería de Sistemas")
    institution VARCHAR(100), -- Institución educativa
    start_date DATE, -- Fecha de inicio del estudio
    end_date DATE, -- Fecha de finalización del estudio (puede ser NULL si aún está en curso)
    description TEXT -- Descripción adicional del estudio
);

-- Índices para optimizar búsquedas por usuario
CREATE INDEX idx_user_professional_studies ON UserProfessionalStudies(user_id);

-- Tabla intermedia para asociar Usuarios con Idiomas, incluyendo nivel y experiencia
CREATE TABLE UserLanguages (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    language_id INT REFERENCES Languages(language_id) ON DELETE CASCADE,
    proficiency_level VARCHAR(50),  -- Nivel de competencia en el idioma
    years_of_experience INT,  -- Años de experiencia con el idioma
    UNIQUE (user_id, language_id)  -- Evita duplicados
);

-- Tabla de Categorías de Habilidades
CREATE TABLE SkillCategories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE -- Nombre de la categoría de habilidad
);

-- Tabla de Habilidades
CREATE TABLE Skills (
    skill_id SERIAL PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL UNIQUE,  -- Nombre de la habilidad
    category_id INT REFERENCES SkillCategories(category_id) ON DELETE SET NULL  -- Categoría de la habilidad
);

-- Tabla intermedia para asociar Usuarios con Habilidades, incluyendo nivel y experiencia
CREATE TABLE UserSkills (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    skill_id INT REFERENCES Skills(skill_id) ON DELETE CASCADE,
    proficiency_level VARCHAR(50),  -- Nivel de competencia
    description TEXT,  -- Descripción del curso
    years_of_experience INT,  -- Años de experiencia en la habilidad
    UNIQUE (user_id, skill_id)  -- Evita duplicados
);

-- Tabla de Solicitudes de conexión
CREATE TABLE FriendRequests (
    request_id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    receiver_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    response_at TIMESTAMP -- Momento en que se responde a la solicitud
);

-- Constraint para asegurar una única solicitud de conexión pendiente entre usuarios
ALTER TABLE FriendRequests ADD CONSTRAINT unique_friend_request UNIQUE (sender_id, receiver_id, status);

-- Tabla de Chats
CREATE TABLE Chats (
    chat_id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Última actividad en el chat
);

-- Tabla de Participantes en los Chats
CREATE TABLE ChatParticipants (
    chat_id INT REFERENCES Chats(chat_id) ON DELETE CASCADE,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    PRIMARY KEY (chat_id, user_id)
);

-- Tabla de Mensajes en los Chats
CREATE TABLE Messages (
    message_id SERIAL PRIMARY KEY,
    chat_id INT REFERENCES Chats(chat_id) ON DELETE CASCADE,
    sender_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar la búsqueda
CREATE INDEX idx_chat_id ON Messages(chat_id);
CREATE INDEX idx_sender_id ON Messages(sender_id);

-- Tabla de Reuniones
CREATE TABLE Meetings (
    meeting_id SERIAL PRIMARY KEY,
    organizer_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    zoom_link VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reminder_time TIMESTAMP -- Hora para enviar un recordatorio
);

-- Tabla de Participantes en las Reuniones
CREATE TABLE MeetingParticipants (
    id SERIAL PRIMARY KEY,
    meeting_id INT REFERENCES Meetings(meeting_id) ON DELETE CASCADE,
    participant_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    email_sent BOOLEAN DEFAULT FALSE
);

-- Tabla de Notificaciones
CREATE TABLE Notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Nueva Tabla de Calificaciones entre Usuarios
CREATE TABLE UserRatings (
    rating_id SERIAL PRIMARY KEY,
    rater_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    ratee_id INT REFERENCES Users(user_id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices adicionales para mejorar la eficiencia en consultas frecuentes
CREATE INDEX idx_meeting_start_time ON Meetings(start_time);
CREATE INDEX idx_meeting_status ON Meetings(status);
CREATE INDEX idx_notification_type ON Notifications(type);
CREATE INDEX idx_rating_ratee_id ON UserRatings(ratee_id);
