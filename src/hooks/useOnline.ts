import {useEffect, useRef} from 'react';
import { userService } from '@/services/user.service';
import { useAuthStore } from "@/store/useAuthStore"

export function useOnline(enabled: boolean) {
    const isMasterTab = useRef<boolean>(true);
    const { user, isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (!enabled) return;
        const bc = new BroadcastChannel('heartbeat');

        bc.onmessage = () => {
            isMasterTab.current = false;
        }

        bc.postMessage("exists");

        if (!isMasterTab.current || !isAuthenticated || !user) return;

        userService.sendOnline(user.id as string);

        const interval = setInterval(() => userService.sendHeartbeat(user.id as string), 15000);

        window.addEventListener("beforeunload", () => userService.sendOffline(user.id as string));

        return () => {
            clearInterval(interval);
            window.removeEventListener("beforeunload", () => userService.sendOffline(user.id as string));
            bc.close();
        };
    },[enabled, isAuthenticated, user]);
}