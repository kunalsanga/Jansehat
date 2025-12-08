package com.sih.telemed.telemedbackend.dto.Appoinment;

import com.sih.telemed.telemedbackend.Enums.AppointmentType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AppointmentRequest {
    private Long patientId;
    private Long doctorId; // optional: patient may request a specific doctor, otherwise null
    private String startTime;
    private String endTime;
    private String teleSlotId;
    private AppointmentType appointmentType;
    private String symptoms;

    // NEW: the village (or smallest geographic unit) of the patient for routing
    private String patientVillage;
}
