import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  FormControl,
  FormLabel,
  Link,
  Sheet,
  Typography,
} from "@mui/joy";
import { z } from "zod";
import { HookFormInput } from "./hook-form-input";
import { HookFormTextArea } from "./hook-form-textarea";
import type { Meta, StoryFn } from "@storybook/react";

const meta: Meta = {
  title: "Components/Hook Form Components",
};

/**
 * Uses the `HookFormInput` input component. The only difference in usage
 * between this component and a raw `<input />` is that we need to provide the
 * errors object coming from the hook form.
 */
export const ExampleLoginForm: StoryFn = () => {
  const resolver = zodResolver(
    z.object({
      userName: z.string().email(),
      password: z.string().min(8),
    }),
  );
  const defaultValues = {
    userName: "",
    password: "",
  };
  const form = useForm({ resolver, defaultValues });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = handleSubmit((data) => {
    alert(`Success! ${data.userName}`);
  });

  return (
    <Sheet
      sx={{
        width: 300,
        mx: "auto",
        my: 4,
        py: 3,
        px: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRadius: "sm",
        boxShadow: "md",
      }}
      variant="outlined"
      component={"form"}
      onSubmit={onSubmit}
    >
      <div>
        <Typography level="h4" component="h1">
          <b>Welcome!</b>
        </Typography>
        <Typography level="body2">Sign in to continue.</Typography>
      </div>
      <FormControl>
        <FormLabel>Email</FormLabel>
        <HookFormInput
          {...register("password")}
          errors={errors}
          type="password"
          placeholder="Password"
        />
      </FormControl>
      <FormControl>
        <FormLabel>Password</FormLabel>
        <HookFormInput
          {...register("password")}
          errors={errors}
          type="password"
          placeholder="Password"
        />
      </FormControl>
      <Button sx={{ mt: 1 }} type="submit">
        Log in
      </Button>
      <Typography
        endDecorator={<Link href="#">Sign up</Link>}
        fontSize="sm"
        sx={{ alignSelf: "center" }}
      >
        Don't have an account?
      </Typography>
    </Sheet>
  );
};

export const ExampleTextArea: StoryFn = () => {
  const resolver = zodResolver(
    z.object({
      text: z.string(),
    }),
  );
  const defaultValues = {
    text: "",
  };

  const form = useForm({ resolver, defaultValues });

  return (
    <Sheet>
      <FormProvider {...form}>
        <HookFormTextArea name="text" />
      </FormProvider>
    </Sheet>
  );
};

export default meta;
