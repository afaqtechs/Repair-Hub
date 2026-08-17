import { Part } from "./parts";
import { Service } from "./services";

export interface SavedParts {
    id: string;
    technician_id: string;
    part_id: string;
    parts: Part;    
    created_at: string;
}


export interface SavedServices {
    id: string;
    technician_id: string;
    service_id: string;
    services: Service;    
    created_at: string;
}