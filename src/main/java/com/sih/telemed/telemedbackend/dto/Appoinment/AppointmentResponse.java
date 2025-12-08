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

    private AppointmentRountingStatus routingStatus;
    private Long assignedDoctorId;
    private String assignedDoctorName;
    private String assignedHospital;

    private AppointmentStatus status;
    private AppointmentType appointmentType;
    private String patientName;
    private String doctorName;

}
