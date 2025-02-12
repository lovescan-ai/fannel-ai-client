"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Creator, Gender } from "@prisma/client";
import FormInput from "@/components/elements/form/FormInput";
import FormSelect from "@/components/elements/form/FormSelect";
import BasicButton from "@/components/elements/buttons/BasicButton";
import LinkSocials, { Account } from "./LinkSocials";
import { useCreateCreator, useUpdateCreator } from "@/lib/hooks/use-creator";
import useReadUser from "@/lib/hooks/use-read-user";
import useConnectSocial, {
  useDisconnectSocial,
} from "@/lib/hooks/use-connect-social";
import { useUploadThing } from "@/utils/uploadthing";
import InstagramIcon from "@/components/ui/icons/instagram";
import UploadImageIcon from "@/components/ui/icons/upload-pic";
import { Loader2, MoreVertical, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useBroadcastChannel from "@/lib/hooks/use-broadcast-channel";
import { useGetAccessToken } from "@/lib/hooks/use-get-access-token";
import { toast } from "sonner";
import { pageTracker } from "@/lib/kv/actions";
interface FormData {
  creator_name: string;
  creator_onlyfans_url: string;
  creator_gender: Gender;
  creator_max_credit: number;
}

interface NewCreatorModalProps {
  setType: React.Dispatch<React.SetStateAction<"" | "edit" | "add">>;
  type: "" | "edit" | "add";
  id: string;
  data?: Creator[];
  setData?: React.Dispatch<React.SetStateAction<Creator[]>>;
  creator?: Creator;
}

const SOCIAL_CONNECT: Account[] = [
  {
    icon: <InstagramIcon />,
    id: "instagram",
    name: "Instagram",
    connected: false,
  },
];

const NewCreatorModal: React.FC<NewCreatorModalProps> = ({
  setType,
  type,
  id,
  data,
  creator,
}) => {
  const { user } = useReadUser();
  const {
    addCreator,
    isPending,
    error,
    data: recentCreator,
  } = useCreateCreator();
  const { connectSocial, authorizationUrl } = useConnectSocial();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { mutate: updateCreator } = useUpdateCreator();
  const { receivedMessages } = useBroadcastChannel("instagram-code");
  const { getAccessToken } = useGetAccessToken("account");
  const { disconnectSocial, isDisconnecting } = useDisconnectSocial();
  const [isConnecting, setIsConnecting] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    creator_name: "",
    creator_onlyfans_url: "",
    creator_gender: Gender.PREFER_NOT_TO_SAY,
    creator_max_credit: 0,
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (type === "edit" && data) {
      const creatorToEdit = data.find((creator) => creator.id === id);
      if (creatorToEdit) {
        setImageUrl(creatorToEdit.profileImageUrl || "");
        setFormData(() => ({
          creator_name: creatorToEdit.name || "",
          creator_onlyfans_url: creatorToEdit.onlyFansUrl || "",
          creator_gender: creatorToEdit.gender || Gender.PREFER_NOT_TO_SAY,
          creator_max_credit: creatorToEdit.maxCredit || 0,
        }));
      }
    }
  }, [type, id, data]);

  const handleConnectInstagram = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsConnecting(true);
      if (type === "add" && user && imageUrl) {
        addCreator({
          gender: formData.creator_gender,
          onlyfansUrl: formData.creator_onlyfans_url,
          creatorName: formData.creator_name,
          userId: user?.id as string,
          profileImageUrl: imageUrl,
          maxCredit: Number(formData.creator_max_credit),
        });

        if (recentCreator) {
        }
        await pageTracker({
          creatorId: creator?.id as string,
          previousPage: "/dashboard/account",
        });
        connectSocial();
        setIsConnecting(false);
      }
      await pageTracker({
        creatorId: creator?.id as string,
        previousPage: "/dashboard/account",
      });
      connectSocial();
      setIsConnecting(false);
    },
    [connectSocial]
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (type === "add" && user && imageUrl) {
        addCreator({
          gender: formData.creator_gender,
          onlyfansUrl: formData.creator_onlyfans_url,
          creatorName: formData.creator_name,
          userId: user.id,
          profileImageUrl: imageUrl,
          maxCredit: Number(formData.creator_max_credit),
        });

        if (data && !error) {
          handleConnectInstagram(e);
        }
      }

      if (type === "edit" && imageUrl) {
        updateCreator({
          creatorId: id,
          data: {
            gender: formData.creator_gender,
            onlyFansUrl: formData.creator_onlyfans_url,
            name: formData.creator_name,
            profileImageUrl: imageUrl,
            maxCredit: Number(formData.creator_max_credit),
          },
        });
      }
      setType("");

      toast.success(
        `Successfully ${type === "add" ? "added" : "updated"} creator`
      );
      setType("");
    } catch (error) {
      console.error("Error handling creator:", error);
      toast.error(`Failed to ${type === "add" ? "add" : "update"} creator`);
    }
  };

  useEffect(() => {
    if (receivedMessages.length > 0) {
      const lastMessage = receivedMessages[receivedMessages.length - 1];
      console.log("Received Instagram code:", lastMessage);
      getAccessToken({
        code: lastMessage,
        creatorId: creator?.id as string,
      });
    }
  }, [receivedMessages]);

  useEffect(() => {
    if (authorizationUrl) {
      setType("");

      window.open(authorizationUrl, "_blank");
    }
  }, [authorizationUrl]);

  useEffect(() => {
    if (creator) {
      setImageUrl(creator.profileImageUrl || "");
      setIsDisabled(!creator.isActive);
    }
  }, [creator]);

  const handleDeleteCreator = () => {
    // Implement delete logic here
    console.log("Deleting creator:", id);
    setIsMenuOpen(false);
    setType("");
  };

  const handleToggleDisable = async () => {
    const newActiveState = isDisabled;
    toast.loading(`${isDisabled ? "Enabling" : "Disabling"} creator...`);

    try {
      await updateCreator({
        creatorId: id,
        data: {
          isActive: newActiveState,
        },
      });

      setIsDisabled(!isDisabled);
      toast.dismiss();
      toast.success(
        `Creator ${newActiveState ? "enabled" : "disabled"} successfully`
      );
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to update creator status");
      setIsDisabled(isDisabled);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (type === "") return null;

  return (
    <div className="border-dashed border-2 border-brandBlue4x w-full z-10 rounded-lg py-12 px-8 bg-white shadow-lg relative">
      <div className="absolute top-4 right-4" ref={menuRef}>
        <motion.button
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileTap={{ scale: 0.95 }}
        >
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </motion.button>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
              <motion.button
                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                onClick={handleDeleteCreator}
                whileHover={{ backgroundColor: "#F9FAFB" }}
                whileTap={{ scale: 0.98 }}
              >
                <Trash2 className="w-5 h-5 mr-3 text-red-500" />
                Delete Creator
              </motion.button>
              <motion.div
                className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                whileHover={{ backgroundColor: "#F9FAFB" }}
              >
                <span className="mr-3">
                  {isDisabled ? "Enable" : "Disable"} Creator
                </span>
                <Switch
                  checked={!isDisabled}
                  onChange={handleToggleDisable}
                  className={`${
                    !isDisabled ? "bg-green-500" : "bg-gray-200"
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="w-full h-full flex flex-col">
        <UploadImage setImageUrl={setImageUrl} imageUrl={imageUrl} />
        <h2 className="text-2xl font-semibold text-center mb-8">
          {type === "add" ? "Add New Creator" : "Edit Creator"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <FormInput
            id="creator_name"
            name="creator_name"
            label="Creator's Name"
            value={formData.creator_name}
            handleChange={handleChange}
            placeholder="Enter Name"
            labelClassName="!font-bold !font-muslish text-lg"
            className="w-full border-none h-14 mulish--regular placeholder:mulish--regular placeholder:text-black text-black text-lg p-1 bg-white shadow-[0px_5px_40px_rgba(69,69,69,0.08)] rounded-lg"
          />

          <FormInput
            id="creator_max_credit"
            name="creator_max_credit"
            label="Creator's Max Credit"
            type="number"
            value={formData.creator_max_credit.toString()}
            handleChange={handleChange}
            placeholder="Enter Max Credit"
            labelClassName="!font-bold !font-muslish text-lg"
            className="w-full border-none h-14 mulish--regular placeholder:mulish--regular placeholder:text-black text-black text-lg p-1 bg-white shadow-[0px_5px_40px_rgba(69,69,69,0.08)] rounded-lg"
          />

          <FormInput
            id="creator_onlyfans_url"
            name="creator_onlyfans_url"
            label="Creator's OnlyFans URL"
            value={formData.creator_onlyfans_url}
            handleChange={handleChange}
            placeholder="Enter OnlyFans URL"
            labelClassName="!font-bold !font-muslish text-lg"
            className="w-full border-none h-14 mulish--regular placeholder:mulish--regular placeholder:text-black text-black text-lg p-1 bg-white shadow-[0px_5px_40px_rgba(69,69,69,0.08)] rounded-lg"
          />

          <FormSelect
            id="creator_gender"
            name="creator_gender"
            label="Gender"
            value={formData.creator_gender}
            labelClassName="!font-bold !font-muslish text-lg"
            className="w-full border-none h-14 mulish--regular placeholder:mulish--regular placeholder:text-black text-black text-lg p-1 bg-white shadow-[0px_5px_40px_rgba(69,69,69,0.08)] rounded-lg"
            handleChange={handleChange}
          >
            <option value={Gender.PREFER_NOT_TO_SAY}>Select gender</option>
            <option value={Gender.MALE}>Male</option>
            <option value={Gender.FEMALE}>Female</option>
            <option value={Gender.OTHER}>Other</option>
          </FormSelect>
          <LinkedAccountsSection
            handleConnectInstagram={handleConnectInstagram}
            accounts={SOCIAL_CONNECT}
            type={creator?.connectedCreator ? "edit" : "add"}
            isDisconnecting={isDisconnecting}
            isConnecting={isConnecting}
            disconnectSocial={() => {
              disconnectSocial({ creatorId: creator?.id as string });
              window.location.reload();
            }}
          />
          <FormActions isLoading={isPending} onCancel={() => setType("")} />
        </form>
      </div>
    </div>
  );
};

const UploadImage: React.FC<{
  setImageUrl: React.Dispatch<React.SetStateAction<string | null>>;
  imageUrl: string | null;
}> = ({ setImageUrl, imageUrl }) => {
  const [__, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      setImageUrl(res[0].url);
    },
  });

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      startUpload([selectedFile]);
      setFile(selectedFile);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
    }
  };

  return (
    <div className="self-center mb-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />
      <button
        onClick={handleButtonClick}
        type="button"
        className="hover:opacity-80 transition-opacity"
      >
        {isUploading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : previewUrl || imageUrl ? (
          <img
            src={previewUrl || imageUrl || ""}
            alt="Selected image"
            className="w-24 h-24 object-cover rounded-full"
          />
        ) : (
          <UploadImageIcon />
        )}
      </button>
    </div>
  );
};

const LinkedAccountsSection: React.FC<{
  handleConnectInstagram: (e: React.FormEvent) => void;
  accounts: Account[];
  type: "add" | "edit";
  isDisconnecting: boolean;
  disconnectSocial: (params: { creatorId: string }) => void;
  isConnecting: boolean;
}> = ({
  handleConnectInstagram,
  accounts,
  type,
  isDisconnecting,
  disconnectSocial,
  isConnecting,
}) => (
  <div className="pt-2 flex flex-col gap-4">
    <p className="mulish--bold text-lg">Linked account</p>
    <div className="bg-gray-50 settings--form--gradient py-2 px-0 rounded-lg shadow-inner flex flex-col gap-4">
      <LinkSocials
        handleConnectInstagram={handleConnectInstagram}
        accounts={accounts}
        type={type}
        isDisconnecting={isDisconnecting}
        isConnecting={isConnecting}
        disconnectSocial={(params: { creatorId: string }) =>
          disconnectSocial({ creatorId: params.creatorId })
        }
      />
    </div>
  </div>
);

const FormActions: React.FC<{
  onCancel: () => void;
  isLoading: boolean;
}> = ({ onCancel, isLoading }) => (
  <div className="flex flex-row items-center justify-center gap-4 pt-4 xs:flex-col">
    <BasicButton
      handleClick={onCancel}
      text="Cancel"
      textColor="text-gray-700"
      className="!w-[267px] h-11 bg-transparent border-brandBlue4x border !text-brandBlue4x"
      disabled={isLoading}
    />
    <BasicButton
      text="Submit"
      className="bg-brandBlue4x hover:bg-opacity-90 text-white !w-[267px] h-11"
      disabled={isLoading}
    />
  </div>
);

const Switch: React.FC<{
  checked: boolean;
  onChange: () => void;
  className?: string;
}> = ({ checked, onChange, className }) => (
  <button
    type="button"
    className={`${className} focus:outline-none focus:ring-0`}
    onClick={onChange}
    role="switch"
    aria-checked={checked}
  >
    <span className="sr-only">Toggle creator status</span>
    <span
      className={`${
        checked ? "translate-x-6" : "translate-x-1"
      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
    />
  </button>
);

export default NewCreatorModal;
