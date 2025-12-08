package com.sih.telemed.telemedbackend.service;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class VillageRoutingService {

    private final Map<String, String> villageToHospital = new HashMap<>();

    public VillageRoutingService() {
        loadMapping();
    }

    private void loadMapping() {

        // -------------------------
        // Hospital A: villages 1–40
        // -------------------------
        List<String> hospA = Arrays.asList(
                "Abhepur","Achal","Agaul","Ageta","Ageti","Ajnauda Kalan","Ajnauda Khurd",
                "Akalgarh","Alhoran","Alipur","Allowal","Babarpur","Banera Kalan","Banera Khurd",
                "Barhe","Bauran Kalan","Bauran Khurd","Bazidpur","Bazidri","Behbalpur",
                "Bhari Panechan","Bhilowal","Bhojo Majri","Bhore","Bina Heri","Bir Agaul","Bir Bauran",
                "Bir Bhadson","Bir Dosanjhan","Birarhwal","Birdhano","Bishangarh","Bishanpura",
                "Bugga Khurd","Chahal","Chaswal","Chathe","Chhaju Bhatt","Chhana Nathuwali"
        );
        hospA.forEach(v -> villageToHospital.put(v.toLowerCase(), "Nabha Civil Hospital"));


        // -------------------------
        // Hospital B: villages 41–80
        // -------------------------
        List<String> hospB = Arrays.asList(
                "Choudhri Majra","Dakaunda","Dandrala Dhindsa","Dandrala Kharaur","Dargapur",
                "Dewangarh","Dhanaura","Dhanauri","Dhangera","Dharoki","Dhingi","Dhundewal",
                "Dittupur Jattan","Doda","Duladi","Faizgarh","Faridpur","Fatehpur","Gadaya",
                "Galwati","Ghamrouda","Ghaniawal","Ghanurki","Ghunder","Gobindgarh Chhanna",
                "Gobindpura","Gujarheri","Gunike","Gurditpura","Hakimpur","Halla","Halotali",
                "Hari Nagar","Harigarh","Hassanpur","Hiana Kalan","Hiana Khurd","Ichhewal",
                "Jasso Majra","Jatiwal"
        );
        hospB.forEach(v -> villageToHospital.put(v.toLowerCase(), "PHC Block 1"));


        // -------------------------
        // Hospital C: villages 81–120
        // -------------------------
        List<String> hospC = Arrays.asList(
                "Jhambali Khas","Jhambali Sahni","Jindalpur","Kaidupur","Kakrala","Kalar Majri",
                "Kalhana","Kalhe Majra","Kalsana","Kameli","Kansuha Kalan","Kansuha Khurd",
                "Kaul","Khanora","Kheri Jattan","Khizerpur","Khokh","Khurd","Kishangarh","Kot Kalan",
                "Kot Khurd","Kotli","Kularan","Labana Karmoo","Labana Teku","Ladha Heri","Lalauda",
                "Lohar Majra","Lopa","Lout","Malewal","Malkon","Mandaur","Mangewal","Mansurpur",
                "Matourda","Mehas","Mohal Gawara","Mungo"
        );
        hospC.forEach(v -> villageToHospital.put(v.toLowerCase(), "PHC Block 2"));


        // -------------------------
        // Hospital D: villages 121–170
        // -------------------------
        List<String> hospD = Arrays.asList(
                "Nabha","Nanoki","Nanowal","Naraingarh","Narmana","Nauhra","Paharpur",
                "Pahlia Kalan","Pahlia Khurd","Paidan","Pednni Khurd","Raimal Majri","Raisal",
                "Raj Garh","Rajpura","Ramgarh","Ramgarh Chhanna","Rampur Sahiewal","Ranjitgarh",
                "Ranno","Rohta","Rohti Basta Singh","Rohti Chhanna","Rohti Khas","Rohti Mouran",
                "Sadhnauli","Sadho Heri","Sahauli","Sakohan","Sakrali","Saluwala","Sangatpura",
                "Sauja","Shahpur","Shamaspur","Shamla","Sheikhpura","Shivgarh","Simbhron",
                "Siri Nagar","Sudhewal","Sukhewal","Suraajpur","Tarkheri Kalan","Tarkheri Khurd",
                "Thuhi","Todarwal","Tohra","Tungan","Udha","Uplan"
        );
        hospD.forEach(v -> villageToHospital.put(v.toLowerCase(), "PHC Block 3"));
    }

    public String getHospitalForVillage(String village) {
        if (village == null) return "Nabha Civil Hospital";
        return villageToHospital.getOrDefault(village.toLowerCase(), "Nabha Civil Hospital");
    }
}
