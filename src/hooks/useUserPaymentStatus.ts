
import { useState, useEffect } from "react";
import { useCurrentUser } from "./useCurrentUser";
import { useProjectPermissions } from "./useProjectPermissions";

export const useUserPaymentStatus = () => {
  const { userId, isLoading: isUserLoading } = useCurrentUser();
  const { canCreate, isLoading: isPermissionLoading, projectCount, isFreeProject, freeLimit } = useProjectPermissions(userId);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(isUserLoading || isPermissionLoading);
  }, [isUserLoading, isPermissionLoading]);

  return { userId, canCreate, isLoading, projectCount, isFreeProject, freeLimit };
};
