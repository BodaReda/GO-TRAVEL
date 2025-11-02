# 👨‍🎓 Student Access Guide

## How Students Can Access Their QR Codes

Students can access their QR codes without needing to login as admin. They just need their **Student ID**.

### Access Methods:

#### Option 1: Direct Student Portal Link
**URL:** `http://192.168.1.9:3000/student`

Students can bookmark this URL or share it with them.

#### Option 2: From Home Page
Students can navigate to: `/student` or `/student-portal`

### How It Works:

1. **Student opens the Student Portal page**
2. **Enters their Student ID** (e.g., STU001)
3. **Views their QR Code** - displays immediately
4. **Shows QR Code to Bus Supervisor** - supervisor scans it with their device
5. **Check Attendance Status** - see if attendance was marked today

### Features for Students:

✅ **View QR Code** - Students can see and download/print their QR code
✅ **Attendance Status** - Check if attendance was marked today
✅ **No Login Required** - Just need Student ID
✅ **Mobile Friendly** - Works perfectly on phones

### For Supervisors:

Supervisors (admins) can:
- Add students in "Manage Students" page
- Give students their **Student ID**
- Students use that ID to access their QR code

### Student Flow:

```
Student → Opens Student Portal → Enters Student ID → Views QR Code → Shows to Supervisor → Supervisor Scans → Attendance Marked ✅
```

### Share with Students:

**Share this link with students:**
```
http://192.168.1.9:3000/student
```

(Replace `192.168.1.9` with your computer's IP if different)

### Mobile Access:

- Students can access from their phones
- QR codes are displayed clearly
- Print button available to save QR code
- Perfect for showing to supervisor

---

## Example Student IDs:

When admin adds students, they get Student IDs like:
- `STU001`
- `STU002`
- `STUDENT123`
- Or any custom ID

Students use this **exact ID** to access their portal.

---

## Tips:

1. **Easy Access:** Create a QR code or link that directs to `/student` page
2. **Bookmark:** Students can bookmark the student portal
3. **Print QR:** Students can print their QR code to keep with them
4. **Same WiFi:** Students need to be on same network as server (for local access)

---

**That's it!** Students just need their Student ID to view their QR code! 🎉


