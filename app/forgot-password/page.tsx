'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function ForgotPasswordPage() {
    const [nip, setNip] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            console.log("Submitting NIP:", nip);

            const response = await fetch('/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nip }),
            });

            console.log("Response status:", response.status);
            console.log("Response headers:", response.headers);

            const text = await response.text();
            console.log("Raw response:", text);

            let result;

            try {
                result = JSON.parse(text);
            } catch (jsonError) {
                console.error("JSON Parse Error:", jsonError);
                setError("Response bukan JSON valid.");
                return;
            }

            console.log("Parsed result:", result);

            if (!response.ok) {
                setError(result.error || 'Gagal memproses permintaan.');
                return;
            }

            setSubmitted(true);
        } catch (err) {
            console.error("Fetch error:", err);
            setError('Terjadi kesalahan.');
        } finally {
            setIsLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background px-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle>Permintaan Dikirim</CardTitle>
                        <CardDescription>
                            Instruksi reset password telah diproses
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-center">
                        <p className="text-sm text-muted-foreground">
                            Jika akun ditemukan, instruksi reset password akan dikirim sesuai
                            metode pemulihan akun yang tersedia.
                        </p>
                        <Link
                            href="/login"
                            className="text-primary hover:underline text-sm"
                        >
                            Kembali ke Login
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle>Lupa Password</CardTitle>
                    <CardDescription>
                        Masukkan NIP untuk memulai proses reset password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="nip" className="text-sm font-medium">
                                NIP
                            </label>
                            <Input
                                id="nip"
                                type="text"
                                value={nip}
                                onChange={(e) => setNip(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-600 text-center">{error}</p>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Memproses...' : 'Reset Password'}
                        </Button>
                    </form>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-muted-foreground">
                            Ingat password?{' '}
                            <Link
                                href="/login"
                                className="text-primary hover:underline"
                            >
                                Login
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}