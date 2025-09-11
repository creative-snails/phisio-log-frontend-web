import axios from "axios";

import { API_BASE_URL } from "~/services/config.ts";
import type { HealthRecord } from "~/types";

export const getHealthRecord = async (id: number) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/${id}`);

    return res.data;
  } catch (err) {
    console.error(`Error fetching health record id=${id}!`, err);
    throw err;
  }
};

export const getHealthRecords = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}`);

    return res;
  } catch (err) {
    console.error("Error fetching health records!", err);
    throw err;
  }
};

export const createHealthRecord = async (data: HealthRecord) => {
  try {
    const res = await axios.post(API_BASE_URL, data);

    return res.data;
  } catch (err) {
    console.error("Error creating health record!", err);
    throw err;
  }
};

export const updateHealthRecord = async (id: number, data: HealthRecord) => {
  try {
    const res = await axios.put(`${API_BASE_URL}/${id}`, data);

    return res;
  } catch (err) {
    console.error(`Error updating health record id=${id}!`, err);
    throw err;
  }
};

export const deleteHealthRecord = async (id: number) => {
  try {
    const res = await axios.delete(`${API_BASE_URL}/${id}`);

    return res;
  } catch (err) {
    console.error(`Error deleting health record id=${id}!`, err);
    throw err;
  }
};
