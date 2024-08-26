import { create } from "zustand";

export interface Contact {
  id?: number;
  firstName: string;
  lastName: string;
  Email: string;
  phone:""
  Subject: string;
  Message: string;
}

export interface ContactStoreState {
  contacts: Contact[];
  contact: Contact;
  getAllContacts: () => Promise<void>;
  getContact: (id: number) => Promise<void>;
  addContact: (data: Contact) => Promise<void>;
  deleteContact: (id: number) => Promise<void>;
}

const baseUrl = "http://localhost:5000/contact-us";

const useContactStore = create<ContactStoreState>((set) => ({
  contacts: [],
  contact: {
    id: 0,
    firstName: "",
    lastName: "",
    Email: "",
    phone:"",
    Subject: "",
    Message: "",
  },
  
  // Fetch all contacts
  getAllContacts: async () => {
    const response = await fetch(`${baseUrl}`);
    const data = await response.json();
    set(() => ({ contacts: data }));
  },
  
  // Fetch a single contact by ID
  getContact: async (id: number) => {
    const response = await fetch(`${baseUrl}/${id}`);
    const data = await response.json();
    set(() => ({ contact: data }));
  },

  // Add a new contact
  addContact: async (data: Contact) => {
    const response = await fetch(`${baseUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const newContact = await response.json();
    set((state) => ({ contacts: [...state.contacts, newContact] }));
  },

  // Delete a contact by ID
  deleteContact: async (id: number) => {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      set((state) => ({
        contacts: state.contacts.filter((c) => c.id !== id),
      }));
    }
  },
}));

export default useContactStore;
