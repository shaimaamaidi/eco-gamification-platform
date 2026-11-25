-- Script d'initialisation des données pour l'application EcoPlatform
-- Exécuté par Spring Boot après la création des tables

INSERT INTO user (
    id_user,
    display_name,
    mail,
    city,
    password,
    role,
    created_at,
    enabled
)
VALUES (
    1,
    'Administrator',
    'admin@eco.com',
    'Tunis',
    '$2a$10$sklKIA7lcLWL.oeUK229zeMMsbjJfmwe//LEgVS1QFcTxbO1o7urG',
    'ADMIN',
    CURRENT_DATE,
    true
);

-- =====================
-- BADGES
-- =====================
INSERT INTO gamification (id_gamification, title, description, goal, icon, gamification_type)
VALUES 
(5, 'Porte d''entrée', 'Créer un compte dans notre plateforme et débloquer ce badge.', 1, '/app/src/main/resources/uploads/badges/badge_d251eb84444928472f3927dada968b3214313270e91968018545427e07f88bdb.png', 'BADGE'),
(6, 'Premier Pas', 'Effectuez votre première action et débloquez ce badge !', 1, '/app/src/main/resources/uploads/badges/badge_146cb4cc4782ba880179e065ef7d88a3285457f15b9cd584eb8259f159a7aace.png', 'BADGE'),
(7, 'Débutant', 'Atteignez 100 points et débloquez votre badge !', 100, '/app/src/main/resources/uploads/badges/badge_e9d8a6c8e644e1cdf10a843bcbc3890a4ae7e63e2055aad2eb7f8600ca9af8e5.jpg', 'BADGE'),
(8, 'Avancé', 'Atteignez 500 points et débloquez votre badge !', 500, '/app/src/main/resources/uploads/badges/badge_233288152dee8e611034b18b80118edb8d19cfff399c9ddc22409ef4e96f5b39.png', 'BADGE'),
(9, 'Expert', 'Atteignez 1000 points et débloquez votre badge !', 1000, '/app/src/main/resources/uploads/badges/badge_f3688be8a1155b8041c50d55fa15c3990cdebb050dae87c915cd735c6836413f.jpg', 'BADGE');

-- =====================
-- CHALLENGES
-- =====================
INSERT INTO gamification (id_gamification, title, description, goal, icon, gamification_type, action, start_date, end_date)
VALUES
(1,'Planteur débutant', 'Planter 1 arbre ou fleur', 1, '/app/src/main/resources/uploads/challenges/challenge_2c0071100bb522bfce0026515689744cd8b1090ca60c20c9b0cebc50b88bb365.png', 'CHALLENGE', 'PLANTATION', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY)),
(2, 'Défi forêt', 'Participer à 10 actions de plantation', 10, '/app/src/main/resources/uploads/challenges/challenge_51df7d1a671fb828f76c2f1436bb29b9185d190646c370a9fabf41ff36fa832c.jpg', 'CHALLENGE', 'PLANTATION', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY)),
(3, 'Maître du tri', 'Effectuez 20 actions de tri', 20, '/app/src/main/resources/uploads/challenges/challenge_3fc870373331c7e9c6283d1df7e60c62c23a445e7d9a4f70c521ff4c9fbcd2e0.png', 'CHALLENGE', 'TRI', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 14 DAY)),
(4, 'Héros du nettoyage', 'Participer à 15 actions de nettoyage', 15, '/app/src/main/resources/uploads/challenges/challenge_c1a9bacfc439cf86168538f453fc02bf43491cea00b01c5b7e75b26a53470e47.png', 'CHALLENGE', 'NETTOYAGE', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 32 DAY));

-- =====================
-- RECOMPENSES
-- =====================
INSERT INTO recompense (id_recompense, name, description, required_badges, icon)
VALUES
(1, 'Tote Bag', 'Débloquez deux badges et gagnez un tote bag', 2, '/app/src/main/resources/uploads/recompenses/recompense_ee12fc40f84b6a26837dd46c2c51826adc51c22cc1a9f581f93a885dd1a81a54.jpg'),
(2, 'Bon d''achat', 'Débloquez 4 badges et gagnez un bon d''achat', 4, '/app/src/main/resources/uploads/recompenses/recompense_83accf70c5de36db68aaef4f4c7495aa70333bacff00f33b93e1a8b89a7e23e6.jpg');
