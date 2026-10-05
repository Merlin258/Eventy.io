"""Database seeder - run with: python seed.py"""

import os
import psycopg2
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
DATABASE_URL = os.getenv("DATABASE_URL")


def seed():
    conn = psycopg2.connect(DATABASE_URL)
    try:
        with conn.cursor() as cur:
            # Insert test users
            cur.execute("""
                INSERT INTO Users (user_id, name, email, role, password) VALUES
                    ('AM.SC.U4CSE25243', 'Rajiv A R',           'rajiv@amrita.edu',   'student',   'pass123'),
                    ('AM.SC.U4CSE25249', 'Shreyas Rajesh Nair', 'shreyas@amrita.edu', 'student',   'pass123'),
                    ('AM.SC.U4CSE25252', 'Sreerag TC',          'sreerag@amrita.edu', 'student',   'pass123'),
                    ('AM.SC.U4CSE25206', 'Aryan Rajesh',        'aryan@amrita.edu',   'student',   'pass123'),
                    ('ADM-001',          'Admin',               'admin@cems.dev',     'organizer', 'admin123')
                ON CONFLICT (user_id) DO NOTHING
            """)
            print("Users inserted")

            # Insert test events
            cur.execute("""
                INSERT INTO Events (event_id, name, description, category, date, time, venue, total_seats) VALUES
                    ('EVT-1001', 'Intro to Machine Learning Workshop',   'Learn the basics of ML with hands-on exercises.',        'Workshop', '2026-09-15', '14:00', 'Engineering Hall, Rm 204',   50),
                    ('EVT-1002', 'Fall Welcome Mixer',                    'Meet your classmates and enjoy snacks and music.',        'Social',   '2026-09-18', '18:30', 'Student Union Courtyard',    200),
                    ('EVT-1003', 'Research Symposium: Climate Systems',   'Presentations on cutting-edge climate research.',         'Academic', '2026-09-20', '10:00', 'Science Center Auditorium', 120),
                    ('EVT-1004', 'Intramural Basketball Finals',          'Cheer on the finalists in the campus championship.',      'Sports',   '2026-09-22', '19:00', 'Rec Center Gym',             60),
                    ('EVT-1005', 'Resume Review with Alumni',             'Get your resume reviewed by industry professionals.',     'Career',   '2026-09-25', '13:00', 'Career Center, Rm 110',      30),
                    ('EVT-1006', 'Startup Pitch Night',                   'Watch student startups pitch to real investors.',          'Career',   '2026-09-28', '17:00', 'Innovation Lab',             40),
                    ('EVT-1007', 'Photography Club: Golden Hour Walk',    'Capture the campus at its most beautiful hour.',           'Social',   '2026-09-30', '18:00', 'Campus Quad',                25),
                    ('EVT-1008', 'Data Structures Study Jam',             'Group study session for the upcoming DSA exam.',           'Academic', '2026-10-02', '16:00', 'Library, Floor 3',           35)
                ON CONFLICT (event_id) DO NOTHING
            """)
            print("Events inserted")

            # Insert sample registrations
            cur.execute("""
                INSERT INTO Registrations (student_id, event_id) VALUES
                    ('AM.SC.U4CSE25243', 'EVT-1001'),
                    ('AM.SC.U4CSE25243', 'EVT-1003'),
                    ('AM.SC.U4CSE25249', 'EVT-1001'),
                    ('AM.SC.U4CSE25249', 'EVT-1002'),
                    ('AM.SC.U4CSE25252', 'EVT-1004'),
                    ('AM.SC.U4CSE25206', 'EVT-1005')
                ON CONFLICT (student_id, event_id) DO NOTHING
            """)
            print("Sample registrations inserted")

            # Insert test notifications
            cur.execute("""
                INSERT INTO Notifications (student_id, message, clear_date) VALUES
                    ('AM.SC.U4CSE25243', 'Reminder: Intro to ML Workshop is tomorrow!',     NOW() + INTERVAL '7 days'),
                    ('AM.SC.U4CSE25249', 'Reminder: Fall Welcome Mixer is this weekend!',    NOW() + INTERVAL '7 days')
            """)
            print("Notifications inserted")

            conn.commit()

        print("\nDatabase seeded successfully!\n")
        print("Login credentials:")
        print("  Student: rajiv@amrita.edu / pass123")
        print("  Student: shreyas@amrita.edu / pass123")
        print("  Student: sreerag@amrita.edu / pass123")
        print("  Student: aryan@amrita.edu / pass123")
        print("  Admin:   admin@cems.dev / admin123")

    except Exception as e:
        conn.rollback()
        print(f"Seed error: {e}")
    finally:
        conn.close()


if __name__ == "__main__":
    seed()
