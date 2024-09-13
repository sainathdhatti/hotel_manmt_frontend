"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import useSpaBookingStore, { BookingStatus, Gender } from "@/app/store/spaBookingStore";
import useAuthStore from "@/app/store/loginStore";
import useSpaServiceStore from "@/app/store/spaServiceStore";
import useTimeSlotStore from "@/app/store/timeSlotStore";
import useUserStore from "@/app/store/userRegisterStore";
import DatePicker from "react-datepicker";
import * as yup from "yup";
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "@/app/navbar";
import Footer from "@/app/footer/page";

// Schema for validation
const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  bookingDate: yup.date().required("Booking date is required"),
  gender: yup
    .string()
    .oneOf([Gender.MALE, Gender.FEMALE], "Invalid gender")
    .required("Gender is required"),
  spaserviceId: yup.number().required("Spa service is required"),
  timeslotId: yup.number().required("Time slot is required"),
});

const SpaBookingForm = () => {
  const { serviceId } = useParams(); // Retrieves serviceId from URL parameters
  const addBooking = useSpaBookingStore((state) => state.addBooking);
  const spaServices = useSpaServiceStore((state) => state.spaServices);
  const fetchSpaServices = useSpaServiceStore(
    (state) => state.getAllSpaServices
  );
  const timeSlots = useTimeSlotStore((state) => state.timeslots);
  const fetchTimeSlots = useTimeSlotStore((state) => state.getAllTimeSlots);
  const users = useUserStore((state) => state.users);
  const fetchUsers = useUserStore((state) => state.getAllUsers);
  const { isAuthenticated, userId } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    userId: state.userId,
  }));

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [bookingDate, setBookingDate] = useState<Date | null>(null);
  const [gender, setGender] = useState<Gender>(Gender.MALE);
  const [selectedSpaService, setSelectedSpaService] = useState<number | null>(
    serviceId ? +serviceId : null
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<number | null>(null);

  useEffect(() => {
    fetchSpaServices();
    fetchTimeSlots();
    fetchUsers();
  }, [fetchSpaServices, fetchTimeSlots, fetchUsers]);

  const router = useRouter();

  const handleSubmit = async () => {
    try {
      await schema.validate({
        firstName,
        lastName,
        bookingDate: bookingDate || new Date(),
        gender,
        spaserviceId: selectedSpaService,
        timeslotId: selectedTimeSlot,
        userId: userId ?? -1, // Handle null case
      });

      if (
        isAuthenticated &&
        selectedSpaService &&
        selectedTimeSlot &&
        bookingDate
      ) {
        const selectedService = spaServices.find(
          (service) => service.id === selectedSpaService
        );
        const selectedSlot = timeSlots.find(
          (slot) => slot.id === selectedTimeSlot
        );
        const currentUser = users.find((u) => u.id === userId);

        if (!selectedService || !selectedSlot || !currentUser) {
          alert("Selected service, time slot, or user not found.");
          return;
        }

        if (userId === undefined || userId === null) {
          alert("User is not authenticated.");
          return;
        }

        console.log(
          firstName,
          lastName,
          gender,
          bookingDate,
          selectedService.id,
          selectedSlot.id,
          userId
        );
        await addBooking({
          firstName,
          lastName,
          gender,
          booking_date: bookingDate,
          userId: userId,
          spaserviceId: selectedService.id,
          timeslotId: selectedSlot.id,
        });
      } else {
        alert(
          "Please complete all required fields and ensure you are logged in."
        );
      }
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        alert(err.errors.join(", "));
      } else {
        console.error("Error submitting booking:", err);
        alert("An error occurred while submitting the booking.");
      }
    }
  };

  const spaService =
    spaServices.find((service) => service.id === Number(serviceId)) || null;

  return (
    <>
    <div className="p-6  relative">
      <Navbar/>
      <div className="absolute  flex inset-0  w-full">
        <img
          src="/images/abc.jpg"
          alt="Background"
          className="opacity-35 w-full h-full object-cover"
        />
      </div>
      <div className="w-1/3 mt-32 relative z-20">
        {spaService ? (
          <>
            <img
              src={spaService.service_image}
              alt={spaService.name || "Spa Service"}
              className="w-full h-auto object-cover"
            />
            <h1 className="ml-24 text-2xl mt-3">
              {spaService.name || "Spa Service"}
            </h1>
          </>
        ) : (
          <p>No image available</p>
        )}
      </div>
      <div className="w-2/3 ml-6 relative z-20 mt-28">
        <div className="flex mb-4 mt-8 ml-10 ">
          <div className="flex-1 mr-2">
            <label className="block text-lg mb-2">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-64 border border-gray-300 rounded-md p-2"
            />
          </div>

          <div className="flex-1 mr-20">
            <label className="block text-lg mb-2">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-64 border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        <div className="flex mb-4 mt-5 ml-10">
          <div className="flex-1 mr-2">
            <label className="block text-lg mb-2">Booking Date</label>
            <DatePicker
              selected={bookingDate}
              onChange={(date: Date | null) => setBookingDate(date)}
              dateFormat="yyyy-MM-dd"
              minDate={new Date()}
              placeholderText="Select booking date"
              className="w-64 border border-gray-300 rounded-md pl-5"
            />
          </div>
          <div className="flex-1 mr-20">
            <label className="block text-lg mb-2">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
              className="w-64 border border-gray-300 rounded-md p-2"
            >
              <option value={Gender.MALE}>Male</option>
              <option value={Gender.FEMALE}>Female</option>
            </select>
          </div>
        </div>

        <div className="flex mb-4 mt-5 ml-10">
          <div className="flex-1 mr-2">
            <label className="block text-lg mb-2">Select Time Slot</label>
            <select
              value={selectedTimeSlot || ""}
              onChange={(e) => setSelectedTimeSlot(Number(e.target.value))}
              className="w-64 border border-gray-300 rounded-md p-2"
            >
              <option value="" disabled>
                Select a time slot
              </option>
              {timeSlots.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {slot.startTime} - {slot.endTime}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 ml-10">
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default SpaBookingForm;
