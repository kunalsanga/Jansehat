package com.sih.telemed.telemedbackend.dto.Appoinment;

import com.sih.telemed.telemedbackend.Enums.AppointmentRountingStatus;
import com.sih.telemed.telemedbackend.Enums.AppointmentStatus;
import com.sih.telemed.telemedbackend.Enums.AppointmentType;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentResponse {

    private Long id;

    private String startTime;
    private String endTime;

    private String teleSlotId;

    private AppointmentStatus status;
    private AppointmentType appointmentType;

    private AppointmentRountingStatus routingStatus;

    private Long assignedDoctorId;    // IMPORTANT FIELD

    private String patientName;
    private String doctorName;
}
