interface UserData {
  user_id: number;
  device_id: string;
  logged_in: string;
  logged_out: string;
  lastSeenAt: string;
}

function calculateMonthlyUsers(
  user_data: UserData[]
): Map<string, { loggedIn: Set<number>; active: Set<number> }> {
  const monthlyUsers = new Map<
    string,
    { loggedIn: Set<number>; active: Set<number> }
  >();

  for (const user of user_data) {
    const { user_id, device_id, logged_in, logged_out, lastSeenAt } = user;
    let selected_date: string;
    if (logged_out !== "") {
      selected_date = logged_out;
    } else if (lastSeenAt !== "") {
      selected_date = lastSeenAt;
    } else {
      selected_date = logged_in;
    }

    const loginDate = new Date(logged_in);
    const logoutDate = new Date(logged_out);
    const lastSeenDate = new Date(lastSeenAt);
    const selectedDate = new Date(selected_date);

    let currentDate = new Date(loginDate);

    while (currentDate <= selectedDate) {
      const month = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}`;
      if (monthlyUsers.has(month)) {
        monthlyUsers.get(month)!.loggedIn.add(user_id);
      } else {
        const counts: { loggedIn: Set<number>; active: Set<number> } = {
          loggedIn: new Set(),
          active: new Set(),
        };

        counts.loggedIn.add(user_id);
        monthlyUsers.set(month, counts);
      }

      if (lastSeenDate >= loginDate && lastSeenDate <= logoutDate) {
        monthlyUsers.get(month)!.active.add(user_id);
      }

      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  }

  return monthlyUsers;
}

const sampleUserData: UserData[] = [
  {
    user_id: 1,
    device_id: "deviceA",
    logged_in: "2022-01-01 10:00:00",
    logged_out: "2022-01-01 12:00:00",
    lastSeenAt: "2022-01-01 11:20:00",
  },
  {
    user_id: 1,
    device_id: "deviceB",
    logged_in: "2022-01-02 12:00:00",
    logged_out: "2022-08-01 11:00:00",
    lastSeenAt: "2022-04-01 13:30:22",
  },
  {
    user_id: 2,
    device_id: "deviceB",
    logged_in: "2022-01-01 09:00:00",
    logged_out: "",
    lastSeenAt: "2022-01-01 10:30:00",
  },
  {
    user_id: 2,
    device_id: "deviceC",
    logged_in: "2022-01-01 11:00:00",
    logged_out: "2022-01-01 13:00:00",
    lastSeenAt: "2022-01-01 12:00:00",
  },
];

const monthlyUsers = calculateMonthlyUsers(sampleUserData);

// console.log(monthlyUsers);

monthlyUsers.forEach((value, key) => {
  console.log(
    `Month ${key}: Logged-in users: ${value.loggedIn.size} Active users: ${value.active.size}`
  );
});
