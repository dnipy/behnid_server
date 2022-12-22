-- CreateTable
CREATE TABLE "passwdReg" (
    "id" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "verifyCode" TEXT NOT NULL,

    CONSTRAINT "passwdReg_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "passwdReg_phone_key" ON "passwdReg"("phone");
