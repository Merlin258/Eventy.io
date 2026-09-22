const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:greagory@localhost:5432/postgres',
});

async function seed() {
  try {
    // Insert test users
    await pool.query(`
      INSERT INTO Users (user_id, name, email, role, password) VALUES
        ('AM.SC.U4CSE25243', 'Rajiv A R', 'rajiv@amrita.edu', 'student', 'pass123'),
        ('AM.SC.U4CSE25249', 'Shreyas Rajesh Nair', 'shreyas@amrita.edu', 'student', 'pass123'),
        ('AM.SC.U4CSE25252', 'Sreerag TC', 'sreerag@amrita.edu', 'student', 'pass123'),
        ('AM.SC.U4CSE25206', 'Aryan Rajesh', 'aryan@amrita.edu', 'student', 'pass123'),
        ('ADM-001', 'Admin', 'admin@cems.dev', 'organizer', 'admin123')
      ON CONFLICT (user_id) DO NOTHING;
    `);
    console.log('✅ Users inserted');

    // Insert test events
    await pool.query(`
      INSERT INTO Events (event_id, name, description, category, date, time, venue, total_seats) VALUES
        ('EVT-1001', 'Intro to Machine Learning Workshop', 'Learn the basics of ML with hands-on exercises.', 'Workshop', '2026-09-15', '14:00', 'Engineering Hall, Rm 204', 50),
        ('EVT-1002', 'Fall Welcome Mixer', 'Meet your classmates and enjoy snacks and music.', 'Social', '2026-09-18', '18:30', 'Student Union Courtyard', 200),
        ('EVT-1003', 'Research Symposium: Climate Systems', 'Presentations on cutting-edge climate research.', 'Academic', '2026-09-20', '10:00', 'Science Center Auditorium', 120),
        ('EVT-1004', 'Intramural Basketball Finals', 'Cheer on the finalists in the campus championship.', 'Sports', '2026-09-22', '19:00', 'Rec Center Gym', 60),
        ('EVT-1005', 'Resume Review with Alumni', 'Get your resume reviewed by industry professionals.', 'Career', '2026-09-25', '13:00', 'Career Center, Rm 110', 30),
        ('EVT-1006', 'Startup Pitch Night', 'Watch student startups pitch to real investors.', 'Career', '2026-09-28', '17:00', 'Innovation Lab', 40),
        ('EVT-1007', 'Photography Club: Golden Hour Walk', 'Capture the campus at its most beautiful hour.', 'Social', '2026-09-30', '18:00', 'Campus Quad', 25),
        ('EVT-1008', 'Data Structures Study Jam', 'Group study session for the upcoming DSA exam.', 'Academic', '2026-10-02', '16:00', 'Library, Floor 3', 35)
      ON CONFLICT (event_id) DO NOTHING;
    `);
    console.log('✅ Events inserted');

    // Insert a few sample registrations
    await pool.query(`
      INSERT INTO Registrations (student_id, event_id) VALUES
        ('AM.SC.U4CSE25243', 'EVT-1001'),
        ('AM.SC.U4CSE25243', 'EVT-1003'),
        ('AM.SC.U4CSE25249', 'EVT-1001'),
        ('AM.SC.U4CSE25249', 'EVT-1002'),
        ('AM.SC.U4CSE25252', 'EVT-1004'),
        ('AM.SC.U4CSE25206', 'EVT-1005')
      ON CONFLICT (student_id, event_id) DO NOTHING;
    `);
    console.log('✅ Sample registrations inserted');

    // Insert a test notification
    await pool.query(`
      INSERT INTO Notifications (student_id, message, clear_date) VALUES
        ('AM.SC.U4CSE25243', 'Reminder: Intro to ML Workshop is tomorrow!', NOW() + INTERVAL '7 days'),
        ('AM.SC.U4CSE25243', 'New event added: Startup Pitch Night', NOW() + INTERVAL '7 days'),
        ('AM.SC.U4CSE25249', 'Reminder: Fall Welcome Mixer is this weekend!', NOW() + INTERVAL '7 days')
      ;
    `);
    console.log('✅ Notifications inserted');

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('Login credentials:');
    console.log('  Student: rajiv@amrita.edu / pass123');
    console.log('  Student: shreyas@amrita.edu / pass123');
    console.log('  Student: sreerag@amrita.edu / pass123');
    console.log('  Student: aryan@amrita.edu / pass123');
    console.log('  Admin:   admin@cems.dev / admin123');

  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    await pool.end();
  }
}

seed();
