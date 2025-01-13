"use client";
import React, { useRef, useState } from 'react'
import { 
    IKImage,
    ImageKitProvider, 
    IKUpload, 
} from "imagekitio-next";
import config from '@/lib/config';
import { Button } from './ui/button';
import Image from 'next/image';
import { toast } from '@/hooks/use-toast';

const {
    env: {
        imagekit: {
            publicKey, 
            urlEndpoint,
        }
    }
} = config;

const authenticator = async () => {
    try {
        const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);
        if(!response.ok){
            const errorText = await response.text();
            throw new Error(`Response failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const {signature, expire, token} = data;
        return {token, expire, signature};
    } catch (error: any) {
        throw new Error(`Authentication request failed: ${error}`);
    }
}

const ImageUpload = ({onFileChange}: {onFileChange : (filePath: string) => void}) => {

  const ikUploadRef = useRef(null);
  const [file, setFile] = useState<{filePath: string} | null>(null);

  const onError = (error: any) => {
    console.log(error)
    toast({
        title: "Image uploaded failed",
        description: `Your image could not be uploaded. Please try again`,
        variant: "destructive",
    })
  }

  const onSucess = (res: any) => {
    setFile(res);
    onFileChange(res.filePath);

    toast({
        title: "Image uploaded successfully",
        description: `${res.filePath} uploaded`,
    })
  }
  
  return (
    <ImageKitProvider 
        publicKey={publicKey}
        urlEndpoint={urlEndpoint}
        authenticator={authenticator}
    >
        <IKUpload 
            className ="hidden" 
            ref = {ikUploadRef} 
            onError={onError} 
            onSuccess={onSucess}
            fileName='test-upload.png'
        />
        <Button 
            className = "flex min-h-14 w-full items-center justify-center gap-1.5 rounded-md border-none font-bold bg-dark-300"
            onClick={(e) =>{
                e.preventDefault();
                if(ikUploadRef.current){
                    //@ts-ignore
                    ikUploadRef.current?.click();
                }
            }}
        >
            <Image
                src = "/icons/upload.svg"
                alt = "upload-icon"
                width={20}
                height={20}
                className = "object-contain"
            />
            <p className = "text-base text-light-100">Upload a file</p>
            {file && <p className = "upload-filename">{file.filePath}</p>}
        </Button>

        {file && (
            <IKImage 
                alt = {file.filePath}
                path = {file.filePath}
                width={500}
                height = {500}
            />
        )}
    </ImageKitProvider>
  )
}

export default ImageUpload
